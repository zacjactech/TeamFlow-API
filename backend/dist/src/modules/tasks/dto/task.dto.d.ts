import { TaskStatus } from '@prisma/client';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    assigned_to?: string;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigned_to?: string;
}
