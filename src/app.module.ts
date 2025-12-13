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
import { PujaCategoryModule } from './puja-category/puja-category.module';
import { PujaItemsModule } from './puja-items/puja-items.module';
import { PujaRequirementsModule } from './puja-requirements/puja-requirements.module';
import { PujaPricingModule } from './puja-pricing/puja-pricing.module';
import { PujaGalleryModule } from './puja-gallery/puja-gallery.module';
import { PujaAddonsModule } from './puja-addons/puja-addons.module';
import { PujaBenefitsModule } from './puja-benefits/puja-benefits.module';
import { BookingModule } from './booking/booking.module';



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
    PujaCategoryModule,
    PujaItemsModule,
    PujaRequirementsModule,
    // BookingModule,
    PujaPricingModule,
    PujaGalleryModule,
    PujaAddonsModule,
    PujaBenefitsModule,
    BookingModule,
  ],
})
export class AppModule {}
