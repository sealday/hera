import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, AppService } from 'src/app/app.service';
import { User } from 'src/users/users.service';
import { convert } from 'src/utils/pinyin';
import { LoggerService } from 'src/app/logger/logger.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    private eventsGateway: EventsGateway,
    private appService: AppService,
    private loggerService: LoggerService,
  ) { }

  async find() {
    return this.projectModel.find()
  }

  private preSave(body: Project) {
    // 1) 生成完整名称
    body.completeName = body.name + body.company
    // 2) 生成拼音
    body.pinyin = convert(body.completeName)
    return body
  }

  async create(body: Project, user: User) {
    const project = await (new this.projectModel(this.preSave(body))).save()
    this.eventsGateway.broadcast({
      name: 'project',
      type: 'create',
      id: project._id,
    })
    // TODO 落下日志
    return project
  }

  async update(body: Project, projectId: string, user: User) {
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      projectId, 
      this.preSave(body), 
      { new: true },
    )
    this.eventsGateway.broadcast({
      name: 'project',
      type: 'update',
      id: projectId,
    })
    return updatedProject
  }

  async findById(projectId: string) {
    return this.projectModel.findById(projectId)
  }

  async removeById(projectId: string, user: User) {
    const removedProject = await this.projectModel.findByIdAndRemove(projectId)
    this.loggerService.logDanger(user, '删除', { message: `删除项目 ${removedProject.completeName}` })
    // 进入回收站
    await this.appService.onDeleted('Project', removedProject, user)
    this.eventsGateway.broadcast({
      name: 'project',
      type: 'delete',
      id: projectId,
    })
    return removedProject
  }

  async switchStatus(status: string, projectId: string, user: User) {
    // status: ['FINISHED', 'UNDERWAY']
    const updatedProject = await this.projectModel.findByIdAndUpdate(projectId, { status }, { new: true })
    if (status === 'FINISHED') {
      this.loggerService.logDanger(user, '禁用', { message: `禁用项目 ${updatedProject.completeName}` })
    } else if (status === 'UNDERWAY') {
      this.loggerService.logDanger(user, '启用', { message: `启用项目 ${updatedProject.completeName}` })
    }
    this.eventsGateway.broadcast({
      name: 'project',
      type: 'update',
      id: projectId,
    })
    return updatedProject
  }
}