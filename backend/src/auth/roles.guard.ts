import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) throw new ForbiddenException('No role found on user');

        const userRoleLower = user.role.toLowerCase();
        const allowedRolesLower = requiredRoles.map(r => r.toLowerCase());

        if (!allowedRolesLower.includes(userRoleLower)) {
            throw new ForbiddenException('You do not have permission (RolesGuard)');
        }

        return true;
    }
}
