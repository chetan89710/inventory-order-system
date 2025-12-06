import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, MinLength, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'User name', example: 'John Doe' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name?: string;

    @ApiPropertyOptional({ description: 'User role', enum: UserRole, example: UserRole.STAFF })
    @IsOptional()
    @IsEnum(UserRole, { message: `Role must be one of: ${Object.values(UserRole).join(', ')}` })
    role?: UserRole;

    @ApiPropertyOptional({ description: 'Password', example: 'newPassword123' })
    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password?: string;
}
