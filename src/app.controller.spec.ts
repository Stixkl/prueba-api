import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Task } from './types/task.type';

describe('AppController', () => {
  let appController: AppController;
  const getTasksMock = jest.fn<() => Promise<Task[]>>();
  const createTaskMock =
    jest.fn<(title: string, is_completed: boolean) => Promise<Task>>();

  const mockTasks: Task[] = [
    { id: 1, title: 'Tarea 1', is_completed: false },
    { id: 2, title: 'Tarea 2', is_completed: true },
  ];

  beforeEach(async () => {
    getTasksMock.mockResolvedValue(mockTasks);
    createTaskMock.mockImplementation((title, is_completed) =>
      Promise.resolve({
        id: 3,
        title,
        is_completed,
      }),
    );

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getTasks: getTasksMock,
            createTask: createTaskMock,
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      await expect(appController.getTasks()).resolves.toEqual(mockTasks);
      expect(getTasksMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const payload = { title: 'Nueva tarea', is_completed: false };

      await expect(appController.createTask(payload)).resolves.toEqual({
        id: 3,
        title: payload.title,
        is_completed: payload.is_completed,
      });
      expect(createTaskMock).toHaveBeenCalledWith(
        payload.title,
        payload.is_completed,
      );
      expect(createTaskMock).toHaveBeenCalledTimes(1);
    });
  });
});
