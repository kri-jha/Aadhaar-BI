import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const total = await prisma.aadhaarTransaction.count();
    const withPincode = await prisma.aadhaarTransaction.count({ where: { pincode: { not: null } } });
    const withoutPincode = await prisma.aadhaarTransaction.count({ where: { OR: [{ pincode: null }, { pincode: '' }] } });

    console.log(`Total: ${total}`);
    console.log(`With Pincode: ${withPincode}`);
    console.log(`Without Pincode: ${withoutPincode}`);

    const sample = await prisma.aadhaarTransaction.findFirst({
        where: { pincode: { not: null } }
    });
    console.log('Sample with pincode:', sample);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
