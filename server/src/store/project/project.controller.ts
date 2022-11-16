import { Controller, UseGuards, Get, UseInterceptors, Post, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectService } from './project.service';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { Project } from 'src/app/app.service';
import { Auth } from 'src/app/user.decorator';
import { User } from 'src/users/users.service';

@Controller('project')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class ProjectController {
  constructor(private projectService: ProjectService) { }

  @Get()
  async list() {
    const projects = await this.projectService.find()
    return { projects }
  }

  @Post()
  async create(@Body() body: Project, @Auth() user: User) {
    const project = await this.projectService.create(body, user);
    return { project }
  }

  @Get(':id')
  async detail(@Param('id') projectId: string) {
    const project = await this.projectService.findById(projectId);
    return { project } }

  @Post(':id')
  async update(@Body() body: Project, @Param('id') projectId: string, @Auth() user: User) {
    const project = await this.projectService.update(body, projectId, user);
    return { project }
  }

  @Post(':id/delete')
  async delete(@Param('id') projectId: string, @Auth() user: User) {
    const project = await this.projectService.removeById(projectId, user)
    return { project }
  }

  @Post(':id/status')
  async status(@Param('id') projectId: string, @Body('status') status: string, @Auth() user: User) {
    const project = await this.projectService.switchStatus(status, projectId, user);
    return { project }
  }
}
