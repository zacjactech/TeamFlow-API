import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(orgId: string): Promise<{
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date;
    }[]>;
    findMe(userId: string): Promise<{
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        organization_id: string;
        created_at: Date;
    }>;
}
