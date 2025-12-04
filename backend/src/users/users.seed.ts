// src/users/users.seed.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeed implements OnModuleInit {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    async onModuleInit() {
        const adminEmail = 'admin@example.com';
        const exists = await this.userModel.findOne({ where: { email: adminEmail } });

        if (!exists) {
            await this.userModel.create({
                name: 'Default Admin',
                email: adminEmail,
                password: await bcrypt.hash('Admin@123', 10), // hash password
                role: UserRole.ADMIN,
            });
            console.log('✔ Default admin created: admin@example.com / Admin@123');
        } else {
            console.log('Default admin already exists');
        }
    }
}
