
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

/**
 * Aadhaar Insights Analysis Notebook
 * 
 * Data Source: 
 * This analysis is based on the dataset ingested from the provided CSV/Excel file 
 * (e.g., "Aadhaar_Data.csv") containing transaction records with fields:
 * date, state, district, ageGroup, enrollmentCount, updateCount, etc.
 */

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Aadhaar Data Analysis...');
    console.log('====================================\n');

    const report: string[] = [];
    report.push('# Aadhaar Behavioral Insights Analysis Report');
    report.push(`Date: ${new Date().toISOString().split('T')[0]}\n`);

    // 1. Overview Statistics
    const totalTransactions = await prisma.aadhaarTransaction.count();
    const totalEnrollments = await prisma.aadhaarTransaction.aggregate({ _sum: { enrollmentCount: true } });
    const totalUpdates = await prisma.aadhaarTransaction.aggregate({ _sum: { updateCount: true } });

    report.push('## 1. Overview Statistics');
    report.push(`- **Total Records Analyzed**: ${totalTransactions}`);
    report.push(`- **Total Enrollments**: ${totalEnrollments._sum.enrollmentCount}`);
    report.push(`- **Total Updates**: ${totalUpdates._sum.updateCount}`);
    report.push('');

    // 2. Age Group Analysis
    const byAge = await prisma.aadhaarTransaction.groupBy({
        by: ['ageGroup'],
        _sum: {
            enrollmentCount: true,
            updateCount: true
        },
        orderBy: {
            _sum: { enrollmentCount: 'desc' }
        }
    });

    report.push('## 2. Age Group Trends');
    report.push('| Age Group | Enrollments | Updates |');
    report.push('|-----------|-------------|---------|');
    byAge.forEach(grp => {
        report.push(`| ${grp.ageGroup} | ${grp._sum.enrollmentCount} | ${grp._sum.updateCount} |`);
    });
    report.push('');

    // 3. State-wise Performance (Top 5)
    const byState = await prisma.aadhaarTransaction.groupBy({
        by: ['state'],
        _sum: { enrollmentCount: true },
        orderBy: {
            _sum: { enrollmentCount: 'desc' }
        },
        take: 5
    });

    report.push('## 3. Top 5 States by Enrollment');
    byState.forEach((st, idx) => {
        report.push(`${idx + 1}. **${st.state}**: ${st._sum.enrollmentCount}`);
    });
    report.push('');

    // 4. Gender Analysis (if available)
    try {
        const byGender = await prisma.aadhaarTransaction.groupBy({
            by: ['gender'],
            _sum: { enrollmentCount: true }
        });

        // Filter out nulls if any
        const validGender = byGender.filter(g => g.gender);
        if (validGender.length > 0) {
            report.push('## 4. Gender Distribution');
            validGender.forEach(g => {
                report.push(`- **${g.gender}**: ${g._sum.enrollmentCount}`);
            });
            report.push('');
        }
    } catch (e) {
        // Gender column might be optional or empty in some datasets
    }

    // Output Report to File
    const reportContent = report.join('\n');
    console.log(reportContent);

    fs.writeFileSync(path.join(__dirname, 'ANALYSIS_OUTPUT.md'), reportContent);
    console.log('\nAnalysis complete! Report saved to backend/ANALYSIS_OUTPUT.md');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
