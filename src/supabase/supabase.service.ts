import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;
  public storage: SupabaseClient['storage']; // ✅ add storage reference

  private readonly logger = new Logger(SupabaseService.name);

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      throw new Error(
        'Supabase URL or SERVICE_KEY missing in environment variables',
      );
    }

    this.client = createClient(url, key, {
      auth: { persistSession: false },
    });

    this.storage = this.client.storage;   // ✅ IMPORTANT FIX

    this.logger.log('🔥 Supabase client initialized with storage support');
  }
}
