import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateTaskDto, userId: string, organizationId: string) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                assigned_to: dto.assigned_to,
                created_by: userId,
                organization_id: organizationId,
            },
            include: {
                creator: {
                    select: { id: true, email: true }
                },
                assignee: {
                    select: { id: true, email: true }
                }
            }
        });
    }

    async findAllInOrg(organizationId: string) {
        return this.prisma.task.findMany({
            where: { organization_id: organizationId },
            include: {
                creator: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(id: string, organizationId: string) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, email: true } },
                assignee: { select: { id: true, email: true } },
            }
        });

        if (!task || task.organization_id !== organizationId) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    async update(id: string, dto: UpdateTaskDto, organizationId: string) {
        const task = await this.findOne(id, organizationId);

        return this.prisma.task.update({
            where: { id: task.id },
            data: dto,
            include: {
                creator: { select: { id: true, email: true } },
                assignee: { select: { id: true, email: true } },
            }
        });
    }

    async remove(id: string, organizationId: string, userRole: Role) {
        const task = await this.findOne(id, organizationId);

        if (userRole !== Role.ADMIN) {
            throw new ForbiddenException('Only Admins can delete tasks');
        }

        return this.prisma.task.delete({
            where: { id: task.id },
        });
    }
}
