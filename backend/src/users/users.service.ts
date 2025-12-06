import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UniqueConstraintError } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    async create(createUserDto: CreateUserDto) {
        try {
            if (createUserDto.role && !Object.values(UserRole).includes(createUserDto.role))
                throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.userModel.create({ ...createUserDto, password: hashedPassword });
            return { statusCode: HttpStatus.CREATED, message: 'User created successfully', data: user };
        } catch (error) {
            if (error instanceof UniqueConstraintError) throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email } });
        return { statusCode: HttpStatus.OK, message: 'User fetched successfully', data: user };
    }

    async findAll() {
        const users = await this.userModel.findAll();
        return { statusCode: HttpStatus.OK, message: 'Users fetched successfully', data: users };
    }

    async findOne(uuid: string) {
        const user = await this.userModel.findByPk(uuid);
        if (!user) throw new NotFoundException('User not found');
        return { statusCode: HttpStatus.OK, message: 'User fetched successfully', data: user };
    }

    async update(uuid: string, updateUserDto: UpdateUserDto) {
        const user = (await this.findOne(uuid)).data;
        if (updateUserDto.role && !Object.values(UserRole).includes(updateUserDto.role))
            throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
        if (updateUserDto.password) updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        await user.update(updateUserDto);
        return { statusCode: HttpStatus.OK, message: 'User updated successfully', data: user };
    }
}
