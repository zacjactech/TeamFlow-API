import { PrismaService } from '../../prisma/prisma.service';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        _count: {
            users: number;
            tasks: number;
        };
    } & {
        id: string;
        created_at: Date;
        name: string;
    }>;
}
