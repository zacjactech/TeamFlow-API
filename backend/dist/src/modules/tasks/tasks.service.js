"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId, organizationId) {
        return this.prisma.task.create({
            data: {
                ...dto,
                created_by: userId,
                organization_id: organizationId,
            },
        });
    }
    async findAllInOrg(organizationId) {
        return this.prisma.task.findMany({
            where: { organization_id: organizationId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id, organizationId) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task || task.organization_id !== organizationId) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async update(id, dto, organizationId) {
        const task = await this.findOne(id, organizationId);
        return this.prisma.task.update({
            where: { id: task.id },
            data: dto,
        });
    }
    async remove(id, organizationId, userRole) {
        const task = await this.findOne(id, organizationId);
        if (userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only Admins can delete tasks');
        }
        return this.prisma.task.delete({
            where: { id: task.id },
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map