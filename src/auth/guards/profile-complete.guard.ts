import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user?.id) {
      throw new ForbiddenException('Invalid user');
    }

    const { data, error } = await this.supabase.client
      .from('users')
      .select('name, email')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      throw new ForbiddenException('User not found');
    }

    if (!data.name || !data.email) {
      throw new ForbiddenException(
        'Please complete your profile before booking',
      );
    }

    return true;
  }
}
