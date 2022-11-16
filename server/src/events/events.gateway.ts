import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);
  private server?: Server

  constructor(private userService: UsersService) { }

  afterInit(server: any) {
    this.server = server
    this.logger.log('消息服务初始化');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('新连接进来了');
  }

  handleDisconnect(client: any) {
    this.logger.log('某个连接断开了');
    this.userService.userDisconnected(client)
    this.server.emit('server:users', this.userService.onlineUsers)
  }

  broadcast(body: any) {
    this.server.emit('server:update', body)
  }

  @SubscribeMessage('client:user')
  userLogined(client: any, payload: any) {
    this.logger.log(`用户登入 ${JSON.stringify(payload)}`)
    this.userService.userLogined(client, payload.user)
    this.server.emit('server:users', this.userService.onlineUsers)
  }
  
  @SubscribeMessage('client:logout')
  userLogouted(client: any, payload: any) {
    this.logger.log(`用户登出`)
    this.userService.userLogouted(client)
    this.server.emit('server:users', this.userService.onlineUsers)
  }
}
