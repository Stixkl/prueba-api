import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { Task } from './types/task.type';

interface SupabaseQueryResult<T> {
  data: T[] | null;
  error: PostgrestError | null;
}

@Injectable()
export class AppService {
  private readonly supabase: ReturnType<typeof createClient>;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.getRequiredEnv('SUPABASE_URL');
    const supabaseKey = this.getRequiredEnv('SUPABASE_KEY');
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getTasks(): Promise<Task[]> {
    try {
      const { data, error } = (await this.supabase
        .from('tasks')
        .select('*')) as SupabaseQueryResult<Task>;
      if (error) {
        throw new InternalServerErrorException(error.message);
      }
      return data ?? [];
    } catch (error: unknown) {
      throw new InternalServerErrorException(this.extractErrorMessage(error));
    }
  }

  async createTask(title: string, is_completed: boolean): Promise<Task> {
    try {
      const payload: Record<string, string | boolean> = { title, is_completed };
      const { data, error } = (await this.supabase
        .from('tasks')
        .insert([payload] as never[])
        .select()) as SupabaseQueryResult<Task>;
      if (error) {
        throw new InternalServerErrorException(error.message);
      }
      const createdTask = data?.[0];
      if (!createdTask) {
        throw new InternalServerErrorException('Task was not created');
      }
      return createdTask;
    } catch (error: unknown) {
      throw new InternalServerErrorException(this.extractErrorMessage(error));
    }
  }

  private getRequiredEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new InternalServerErrorException(
        `Missing environment variable: ${key}`,
      );
    }
    return value;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (this.isPostgrestError(error)) {
      return error.message;
    }
    return 'Unexpected internal error';
  }

  private isPostgrestError(error: unknown): error is PostgrestError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    );
  }
}
