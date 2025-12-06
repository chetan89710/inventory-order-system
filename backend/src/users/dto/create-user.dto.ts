import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty({ message: 'Name must not be empty' })
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'User email address' })
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email must not be empty' })
    email: string;

    @ApiProperty({ example: '123456', description: 'User password, minimum 6 characters' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Password must not be empty' })
    password: string;

    @ApiProperty({ example: 'staff', enum: UserRole, required: false, description: 'Role of the user' })
    @IsEnum(UserRole, { message: `Role must be one of: ${Object.values(UserRole).join(', ')}` })
    @IsOptional()
    role?: UserRole;
}
