import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = await this.userModel.create(createUserDto);
            return user;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpException(
                    { statusCode: HttpStatus.CONFLICT, message: 'Email already exists' },
                    HttpStatus.CONFLICT
                );
            }

            console.error('User creation failed:', error);
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userModel.findByPk(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return user.update(updateUserDto);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ where: { email } });
    }
}
