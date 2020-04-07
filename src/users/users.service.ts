import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { LoggerService } from 'src/app/logger/logger.service';

export type User = any;

@Injectable()
export class UsersService {
    private users: Map<Socket, User> = new Map()

    constructor(
        @InjectModel('Users') private usersModel: Model<User>,
        private loggerService: LoggerService,
    ) { }

    async create(user: User): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        const createdUser = new this.usersModel(user);
        return createdUser.save()
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.usersModel.findOne({ username }).lean();
    }

    userLogouted(socket: Socket) {
        this.users.delete(socket)
    }

    userLogined(socket: Socket, user: User) {
        this.users.set(socket, user)
    }

    userDisconnected(socket: Socket) {
        this.users.delete(socket)
    }

    public get onlineUsers() : User[] {
        return [...this.users.values()]
    }

    async list() {
        const users = await this.usersModel.find()
        return users
    }

    async update(body: User, userId: string, user: User) {
        this.loggerService.logDanger(user, '修改', { message: '更新' + user.profile.name + '的资料' })
        const findUser = await this.usersModel.findById(userId)
        // 修改密码
        if (body.password) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(body.password, salt);
            body.password = hashedPassword;
        }
        Object.assign(findUser, body)
        const savedUser = await findUser.save()
        return savedUser
    }

    async remove(userId: string) {
        const user = await this.usersModel.findByIdAndRemove(userId)
        return user
    }
}