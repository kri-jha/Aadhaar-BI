import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.aadhaarTransaction.count();
    console.log(`Total transactions in DB: ${count}`);

    const byAge = await prisma.aadhaarTransaction.groupBy({
        by: ['ageGroup'],
        _sum: { enrollmentCount: true }
    });
    console.log('Enrollments by Age:', byAge);

    const sample = await prisma.aadhaarTransaction.findFirst();
    console.log('Sample Record:', sample);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
