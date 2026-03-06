import { Role } from '@prisma/client';
export interface UserPayload {
    id: string;
    email: string;
    role: Role;
    organizationId: string;
}
export declare const GetUser: (...dataOrPipes: (keyof UserPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
