import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import { Task } from './../src/types/task.type';
import { CreateTaskDto } from './../src/dto/create-task.dto';
import {
  describe,
  expect,
  it,
  jest,
  afterEach,
  beforeEach,
} from '@jest/globals';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const mockTasks: Task[] = [
    { id: 1, title: 'Tarea e2e 1', is_completed: false },
    { id: 2, title: 'Tarea e2e 2', is_completed: true },
  ];

  const getTasksMock = jest
    .fn<() => Promise<Task[]>>()
    .mockResolvedValue(mockTasks);
  const createTaskMock = jest
    .fn<(title: string, is_completed: boolean) => Promise<Task>>()
    .mockImplementation((title: string, is_completed: boolean) =>
      Promise.resolve({
        id: 3,
        title,
        is_completed,
      }),
    );

  const appServiceMock: Pick<AppService, 'getTasks' | 'createTask'> = {
    getTasks: getTasksMock,
    createTask: createTaskMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(appServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('/tasks (GET)', async () => {
    await request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect(mockTasks);
    expect(appServiceMock.getTasks).toHaveBeenCalledTimes(1);
  });

  it('/tasks (POST)', async () => {
    const payload: CreateTaskDto = { title: 'Creada e2e', is_completed: false };
    await request(app.getHttpServer())
      .post('/tasks')
      .send(payload)
      .expect(201)
      .expect({ id: 3, ...payload });
    expect(createTaskMock).toHaveBeenCalledWith(
      payload.title,
      payload.is_completed,
    );
  });

  it('/tasks (POST) should validate payload', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: '', is_completed: 'no', unexpected: true })
      .expect(400);
  });
});
