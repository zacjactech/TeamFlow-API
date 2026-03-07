import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created' })
  create(
    @Body() dto: CreateTaskDto,
    @GetUser('id') userId: string,
    @GetUser('organizationId') orgId: string,
  ) {
    return this.tasksService.create(dto, userId, orgId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks in the organization' })
  findAll(@GetUser('organizationId') orgId: string) {
    return this.tasksService.findAllInOrg(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  findOne(@Param('id') id: string, @GetUser('organizationId') orgId: string) {
    return this.tasksService.findOne(id, orgId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @GetUser('organizationId') orgId: string,
  ) {
    return this.tasksService.update(id, dto, orgId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (Admin only)' })
  remove(
    @Param('id') id: string,
    @GetUser('organizationId') orgId: string,
    @GetUser('role') role: Role,
  ) {
    return this.tasksService.remove(id, orgId, role);
  }
}
