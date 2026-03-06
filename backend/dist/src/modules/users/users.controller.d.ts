import { UsersService } from './users.service';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(orgId: string): Promise<{
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date;
    }[]>;
    invite(dto: InviteMemberDto, orgId: string): Promise<{
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date;
    }>;
    findMe(userId: string): Promise<{
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        organization_id: string;
        created_at: Date;
    }>;
}
