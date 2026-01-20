import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const STATES = ['Bihar', 'Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Rajasthan'];
const DISTRICTS: Record<string, string[]> = {
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Gopalganj'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur']
};

const AGE_GROUPS = ['0-5', '5-17', '18-45', '45-60', '60+'];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData() {
    const data = [];
    const startDate = new Date('2024-11-01'); // Start from Nov 1, 2024
    const endDate = new Date('2025-01-31');   // Up to Jan 31, 2025

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);

        // Create spike on specific dates (e.g., Jan 22, 2025)
        const isSpikeDay = currentDate.toISOString().split('T')[0] === '2025-01-22';
        const multiplier = isSpikeDay ? 3.5 : 1.0;

        for (const state of STATES) {
            for (const district of DISTRICTS[state]) {
                for (const ageGroup of AGE_GROUPS) {
                    // Base activity
                    const enrollmentCount = Math.floor(randomInt(50, 500) * multiplier);
                    const updateCount = Math.floor(randomInt(100, 800) * multiplier);
                    const rejectionCount = Math.floor((enrollmentCount + updateCount) * (Math.random() * 0.2)); // 0-20% rejection

                    const centerLoad = Math.min(100, (enrollmentCount + updateCount) / 10); // Simple load calc

                    data.push({
                        id: uuidv4(),
                        date: currentDate,
                        state,
                        district,
                        ageGroup,
                        enrollmentCount,
                        updateCount,
                        rejectionCount,
                        centerLoad,
                        gender: Math.random() > 0.5 ? 'Male' : 'Female'
                    });
                }
            }
        }
    }
    return data;
}

async function main() {
    console.log('Generating synthetic data...');
    const data = generateData();
    console.log(`Generated ${data.length} records.`);

    console.log('Seeding data into database...');
    // Batch insert
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        await prisma.aadhaarTransaction.createMany({
            data: batch
        });
        console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
