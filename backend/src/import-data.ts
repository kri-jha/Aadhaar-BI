import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function importData(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    console.log(`Reading file stream: ${filePath}`);

    const BATCH_SIZE = 1000;
    let batch: any[] = [];
    let totalInserted = 0;
    let totalProcessed = 0;

    const processBatch = async () => {
        if (batch.length === 0) return;
        try {
            await prisma.aadhaarTransaction.createMany({
                data: batch
            });
            totalInserted += batch.length;
            process.stdout.write(`\rInserted: ${totalInserted} | Processed: ${totalProcessed}`);
            batch = [];
        } catch (error) {
            console.error('\nError inserting batch:', error);
            // Don't exit, just log and continue? Or maybe stop?
            // For now, let's stop to avoid partial corrupted state if critical
            // process.exit(1); 
            // Actually better to empty batch and continue if just a few bad rows, but createMany fails whole batch.
            // We'll clear batch to proceed.
            batch = [];
        }
    };

    const stream = fs.createReadStream(filePath)
        .pipe(csv());

    for await (const row of stream) {
        totalProcessed++;

        // Helper to get value loosely
        const getValue = (key: string) => {
            if (row[key] !== undefined) return row[key];
            const lowerKey = key.toLowerCase();
            const foundKey = Object.keys(row).find(k => k.toLowerCase() === lowerKey);
            return foundKey ? row[foundKey] : undefined;
        };

        const dateStr = getValue('date') || getValue('Date');
        if (!dateStr) continue;

        try {
            const baseRecord = {
                date: new Date(dateStr),
                state: getValue('state') || getValue('State') || 'Unknown',
                district: getValue('district') || getValue('District') || 'Unknown',
                pincode: String(getValue('pincode') || getValue('Pincode') || ''),
                // Default metrics
                updateCount: 0,
                rejectionCount: 0,
                centerLoad: 0,
                gender: null
            };

            // Pivot Age Columns
            const addRecord = (ageGroup: string, countVal: any) => {
                const count = Number(countVal || 0);
                if (count > 0) {
                    batch.push({
                        ...baseRecord,
                        ageGroup,
                        enrollmentCount: count
                    });
                }
            };

            addRecord('0-5', getValue('age_0_5'));
            addRecord('5-17', getValue('age_5_17'));
            addRecord('18+', getValue('age_18_greater'));

            if (batch.length >= BATCH_SIZE) {
                // Pause stream? No, for await handles backpressure cleanly usually, 
                // but we need to await the db insert.
                await processBatch();
            }

        } catch (err) {
            console.warn('\nSkipping invalid row:', err);
        }
    }

    // Final batch
    await processBatch();

    console.log(`\nImport completed. Total inserted records: ${totalInserted}`);
}

const filePath = process.argv[2];
if (!filePath) {
    console.log('Usage: npx ts-node src/import-data.ts <path-to-csv-file>');
    process.exit(1);
}

importData(filePath)
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
