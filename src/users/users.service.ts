import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

export type User = any;

@Injectable()
export class UsersService {
    private users: Map<Socket, User> = new Map()

    constructor(@InjectModel('Users') private usersModel: Model<User>) { }

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
}
