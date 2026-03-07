import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async inviteMember(dto: InviteMemberDto, organizationId: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        password_hash: hashedPassword,
        role: Role.MEMBER,
        organization_id: organizationId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  async findAllInOrg(organizationId: string) {
    return await this.prisma.user.findMany({
      where: { organization_id: organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        organization_id: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
