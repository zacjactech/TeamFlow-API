import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Role } from '@prisma/client';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTaskDto, userId: string, organizationId: string): Promise<{
        creator: {
            email: string;
            id: string;
        };
        assignee: {
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        assigned_to: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
    findAllInOrg(organizationId: string): Promise<({
        creator: {
            email: string;
            id: string;
        };
        assignee: {
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        assigned_to: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    })[]>;
    findOne(id: string, organizationId: string): Promise<{
        creator: {
            email: string;
            id: string;
        };
        assignee: {
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        assigned_to: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
    update(id: string, dto: UpdateTaskDto, organizationId: string): Promise<{
        creator: {
            email: string;
            id: string;
        };
        assignee: {
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        assigned_to: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
    remove(id: string, organizationId: string, userRole: Role): Promise<{
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        assigned_to: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
}
