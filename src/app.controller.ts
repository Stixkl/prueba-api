import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './types/task.type';

@Controller('tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async getTasks(): Promise<Task[]> {
    return await this.appService.getTasks();
  }
  @Post()
  async createTask(@Body() body: CreateTaskDto): Promise<Task> {
    return await this.appService.createTask(body.title, body.is_completed);
  }
}
