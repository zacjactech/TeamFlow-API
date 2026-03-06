import { PrismaClient } from './backend/src/generated/prisma-client';
import 'dotenv/config';

async function main() {
    console.log('Testing PrismaClient initialization...');
    try {
        const prisma = new PrismaClient({
            // @ts-ignore
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        });
        console.log('Initialized with datasources (plural)');
    } catch (e) {
        console.error('Failed with datasources (plural):', e.message);
    }

    try {
        const prisma = new PrismaClient({
            // @ts-ignore
            datasource: {
                url: process.env.DATABASE_URL
            }
        });
        console.log('Initialized with datasource (singular)');
    } catch (e) {
        console.error('Failed with datasource (singular):', e.message);
    }

    try {
        const prisma = new PrismaClient();
        console.log('Initialized with no options');
    } catch (e) {
        console.error('Failed with no options:', e.message);
    }
}

main();
