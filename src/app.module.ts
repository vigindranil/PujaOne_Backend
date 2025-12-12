import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Core system modules
import { SupabaseModule } from './supabase/supabase.module';
import { LoggerModule } from './logger/logger.module';
import { EncryptionModule } from './crypto/encryption.module';

// Feature modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PurohitModule } from './purohit/purohit.module';

import { DevToolsModule } from './devtools/devtools.module';
// import { BookingModule } from './booking/booking.module';
import { PujaModule } from './puja/puja.module';



@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Core infrastructure
    SupabaseModule,
    LoggerModule,
    EncryptionModule,

    // Feature modules
    UsersModule,
    AuthModule,
    PurohitModule,
    DevToolsModule,
    PujaModule,
    // BookingModule,
  ],
})
export class AppModule {}
