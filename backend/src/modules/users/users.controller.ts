import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';
import { InviteMemberDto } from './dto/invite-member.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users in the organization (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@GetUser('organizationId') orgId: string) {
    return this.usersService.findAllInOrg(orgId);
  }

  @Post('invite')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Invite/Add a new member to the organization (Admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully created/invited' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
  invite(
    @Body() dto: InviteMemberDto,
    @GetUser('organizationId') orgId: string,
  ) {
    return this.usersService.inviteMember(dto, orgId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  findMe(@GetUser('id') userId: string) {
    return this.usersService.findOne(userId);
  }
}
