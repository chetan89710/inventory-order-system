import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeed implements OnModuleInit {
    constructor(@InjectModel(User) private readonly userModel: typeof User) { }

    async onModuleInit() {
        await this.createUserIfNotExists(
            'admin@example.com',
            'Default Admin',
            'Admin@123',
            UserRole.ADMIN,
        );

        await this.createUserIfNotExists(
            'staff@example.com',
            'Default Staff',
            'Staff@123',
            UserRole.STAFF,
        );

        await this.createUserIfNotExists(
            'customer@example.com',
            'Default Customer',
            'Customer@123',
            UserRole.CUSTOMER,
        );
    }

    private async createUserIfNotExists(
        email: string,
        name: string,
        plainPassword: string,
        role: UserRole,
    ) {
        const exists = await this.userModel.findOne({
            where: { email },
            attributes: ['uuid'],
        });

        if (!exists) {
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            await this.userModel.create({ name, email, password: hashedPassword, role });
            console.log(`✔ ${role} created: ${email} / ${plainPassword}`);
        } else {
            console.log(`⚠ ${role} already exists: ${email}`);
        }
    }
}
