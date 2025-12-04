import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    // Validate credentials
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    // Login and generate JWT
    async login(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role.toLowerCase() };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    // Refresh access token
    async refresh(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role.toLowerCase() };
        return { access_token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
    }
}
