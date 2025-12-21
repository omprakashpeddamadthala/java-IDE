import { IProblemRepository } from './IProblemRepository';
import { SupabaseProblemRepository } from './SupabaseProblemRepository';
import { appConfig } from '../config/app.config';

export class ProblemRepositoryFactory {
  static create(): IProblemRepository {
    const { database } = appConfig;
    return new SupabaseProblemRepository(
      database.supabase.url,
      database.supabase.anonKey
    );
  }
}
