import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UniqueConstraintError } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            if (createUserDto.role && !Object.values(UserRole).includes(createUserDto.role)) {
                throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
            }

            return await this.userModel.create(createUserDto);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ where: { email } });
    }

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async findOne(uuid: string): Promise<User> {
        const user = await this.userModel.findByPk(uuid);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(uuid);

        if (updateUserDto.role && !Object.values(UserRole).includes(updateUserDto.role)) {
            throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
        }

        return user.update(updateUserDto);
    }
}