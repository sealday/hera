import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoggerService } from 'src/app/logger/logger.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private loggerService: LoggerService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && await compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        this.loggerService.logInfo(user, '登录', { message: '成功登录' })
        return {
            access_token: this.jwtService.sign(user),
        };
    }
}
