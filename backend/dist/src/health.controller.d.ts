import { PrismaService } from './prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        uptime: number;
        database: string;
        timestamp: string;
    } | {
        status: string;
        database: string;
        timestamp: string;
        uptime?: undefined;
    }>;
}
