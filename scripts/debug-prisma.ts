import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
    console.log('Models on db:', Object.keys(db).filter(k => k[0] !== '_'));
    try {
        const card = await (db as any).card.findFirst();
        console.log('Card fields:', card ? Object.keys(card) : 'No cards found');
    } catch (e) {
        console.log('Error accessing card:', (e as any).message);
    }
}

main();
