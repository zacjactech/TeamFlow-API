import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private organizationsService;
    constructor(organizationsService: OrganizationsService);
    getOrg(orgId: string): Promise<{
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
