import { supabase } from '../config/supabase';

export interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
}

export interface ProblemProgress {
  user_id: string;
  solved_count: number;
  total_attempts: number;
}

export interface AddProblemData {
  title: string;
  description: string;
  difficulty: string;
  starter_code: string;
  solution_code: string;
  test_cases: string;
}

export class AdminService {
  async getAllUsers(): Promise<UserData[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getUserProgress(): Promise<Record<string, ProblemProgress>> {
    const { data, error } = await supabase
      .from('user_problem_progress')
      .select('user_id, is_solved');

    if (error) throw error;

    const progressMap: Record<string, ProblemProgress> = {};
    data?.forEach(record => {
      if (!progressMap[record.user_id]) {
        progressMap[record.user_id] = {
          user_id: record.user_id,
          solved_count: 0,
          total_attempts: 0
        };
      }
      progressMap[record.user_id].total_attempts++;
      if (record.is_solved) {
        progressMap[record.user_id].solved_count++;
      }
    });

    return progressMap;
  }

  async toggleUserBlockStatus(userId: string, currentStatus: boolean): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_blocked: !currentStatus })
      .eq('id', userId);

    if (error) throw error;
  }

  async toggleUserAdminStatus(userId: string, currentStatus: boolean): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (error) throw error;
  }

  async addProblem(problemData: AddProblemData): Promise<void> {
    const { error } = await supabase
      .from('java_problems')
      .insert([problemData]);

    if (error) throw error;
  }
}

export const adminService = new AdminService();
