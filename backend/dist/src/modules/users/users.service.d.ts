import { PrismaService } from '../../prisma/prisma.service';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    inviteMember(dto: InviteMemberDto, organizationId: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date;
    }>;
    findAllInOrg(organizationId: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        organization_id: string;
        created_at: Date;
    }>;
}
