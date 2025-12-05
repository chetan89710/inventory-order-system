import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'User name', example: 'John Doe' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'User role', enum: UserRole, example: UserRole.STAFF })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({ description: 'Password', example: 'newPassword123' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
