import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Role } from '@prisma/client';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(dto: CreateTaskDto, userId: string, orgId: string): Promise<{
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
    findAll(orgId: string): Promise<({
        user: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    })[]>;
    findOne(id: string, orgId: string): Promise<{
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
    update(id: string, dto: UpdateTaskDto, orgId: string): Promise<{
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
    remove(id: string, orgId: string, role: Role): Promise<{
        id: string;
        organization_id: string;
        created_at: Date;
        description: string | null;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        created_by: string;
    }>;
}
