import { PrismaService } from '../../prisma/prisma.service';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        _count: {
            tasks: number;
            users: number;
        };
    } & {
        id: string;
        created_at: Date;
        name: string;
    }>;
}
