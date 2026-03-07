import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role, User as PrismaUser } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      this.logger.warn(`Registration failed: User ${dto.email} already exists`);
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create organization and user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          password_hash: hashedPassword,
          role: Role.ADMIN, // First user is Admin
          organization_id: organization.id,
        },
      });

      return { user, organization };
    });

    this.logger.log(`User registered successfully: ${dto.email}`);
    return this.generateToken(result.user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in successfully: ${dto.email}`);
    return this.generateToken(user);
  }

  private generateToken(user: PrismaUser) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organization_id,
      },
    };
  }
}
