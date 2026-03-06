import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllInOrg(organizationId: string): Promise<{
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        organization_id: string;
        created_at: Date;
    }>;
}
