import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async getTasks() {
    return await this.appService.getTasks();
  }
  @Post()
  async createTask(@Body() body: { title: string; is_completed: boolean }) {
    return await this.appService.createTask(body.title, body.is_completed);
  }
}

