import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<User> {
        const userResp = await this.usersService.findByEmail(email);
        const user = userResp.data;
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    async login(user: User) {
        const payload = { sub: user.uuid, email: user.email, role: user.role.toLowerCase() };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET });
        return { statusCode: 200, message: 'Login successful', data: { accessToken, refreshToken } };
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) throw new UnauthorizedException('Refresh token missing');
        let payload: any;
        try { payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET }); }
        catch { throw new UnauthorizedException('Invalid or expired refresh token'); }

        const userResp = await this.usersService.findOne(payload.sub);
        const user = userResp.data;
        if (!user) throw new UnauthorizedException('User not found');

        const newPayload = { sub: user.uuid, email: user.email, role: user.role.toLowerCase() };
        const accessToken = this.jwtService.sign(newPayload, { expiresIn: '1h' });
        return { statusCode: 200, message: 'Access token refreshed', data: { accessToken } };
    }
}
