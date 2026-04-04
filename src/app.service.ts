import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  private supabase: SupabaseClient;
  
  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY') || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  async getTasks(): Promise<any> {
    try {
      const { data, error } = await this.supabase.from('tasks').select('*');
      if (error) {
        throw new InternalServerErrorException(error.message);
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createTask(title: string, is_completed: boolean): Promise<any> {
    try {
      const { data, error } = await this.supabase.from('tasks').insert([{ title, is_completed }]).select();
      if (error) {
        throw new InternalServerErrorException(error.message);
      }
      return data[0];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}