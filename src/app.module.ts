import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

// Core system modules
import { SupabaseModule } from './supabase/supabase.module';
import { LoggerModule } from './logger/logger.module';
import { EncryptionModule } from './crypto/encryption.module';

// Feature modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PurohitModule } from './purohit/purohit.module';
import { DevToolsModule } from './devtools/devtools.module';
import { PujaModule } from './puja/puja.module';
import { PujaCategoryModule } from './puja-category/puja-category.module';
import { PujaItemsModule } from './puja-items/puja-items.module';
import { PujaRequirementsModule } from './puja-requirements/puja-requirements.module';
import { PujaPricingModule } from './puja-pricing/puja-pricing.module';
import { PujaGalleryModule } from './puja-gallery/puja-gallery.module';
import { PujaAddonsModule } from './puja-addons/puja-addons.module';
import { PujaBenefitsModule } from './puja-benefits/puja-benefits.module';
import { BookingModule } from './booking/booking.module';
import { PurohitAvailabilityModule } from './purohit-availability/purohit-availability.module';
import { SamagriKitsModule } from './samagri-kits/samagri-kits.module';

// 🔐 GLOBAL GUARDS
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
// 🔒 Throttling for rate limit

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PaymentsModule } from './payment/payment.module';

import { InvoiceModule } from './invoice/invoice.module';
import { EmailModule } from './email/email.module';




@Module({
  imports: [
    // 🌍 ENV
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🚀 GLOBAL CACHE (🔥 ADD THIS)
    CacheModule.register({
      isGlobal: true,
      ttl: 600, // 10 minutes
      max: 1000,
    }),
   // 🚦 RATE LIMITING (ANTI-ABUSE)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,     // seconds
          limit: 100,  // requests per IP
        },
      ],
    }),




    // 🔧 Core infra
    SupabaseModule,
    LoggerModule,
    EncryptionModule,

    // 📦 Feature modules
    UsersModule,
    AuthModule,
    PurohitModule,
    DevToolsModule,
    PujaModule,
    PujaCategoryModule,
    PujaItemsModule,
    PujaRequirementsModule,
    PujaPricingModule,
    PujaGalleryModule,
    PujaAddonsModule,
    PujaBenefitsModule,
    BookingModule,
    PurohitAvailabilityModule,
    SamagriKitsModule,
    PaymentsModule,
    EmailModule,
    InvoiceModule,
  
  ],

  // 🔐 GLOBAL GUARDS
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,   // 1️⃣ Auth
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,     // 2️⃣ Role
    },
  ],
  
})
export class AppModule {}
