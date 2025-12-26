import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/guards/roles.decorator';
// OPTIONAL (agar RolesGuard already use ho raha hai project me)
// import { Roles } from '../../auth/decorators/roles.decorator';
// import { RolesGuard } from '../../auth/guards/roles.guard';

import { DashboardService } from './dashboard.service';

@ApiTags('Admin / Dashboard')
@ApiBearerAuth()
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard) // 🔐 JWT compulsory (ADMIN token hi aayega)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  // =====================================================
  // 🔹 TOP SUMMARY CARDS  
  // =====================================================
  @Roles("ADMIN")
  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }

  // =====================================================
  // 📊 CHARTS
  // =====================================================

  // 🔹 MONTHLY BOOKINGS CHART
  @Roles("ADMIN")
  @Get('charts/bookings')
  getBookingChart() {
    return this.service.getMonthlyBookings();
  }

  // 🔹 MONTHLY REVENUE CHART
  @Roles("ADMIN")
  @Get('charts/revenue')
  getRevenueChart() {
    return this.service.getMonthlyRevenue();
  }

  // =====================================================
  // 🔔 ALERTS
  // =====================================================

  // 🔹 TODAY PUJA ALERTS
  @Roles("ADMIN")
  @Get('alerts/today-puja')
  getTodayPujaAlerts() {
    return this.service.getTodayPujaAlerts();
  }

  // 🔹 PENDING ACTION ALERTS
  @Get('alerts/pending')
  @Roles("ADMIN")
  getPendingAlerts() {
    return this.service.getPendingAlerts();
  }

  // 🔹 INVENTORY ALERTS (🔥 NEW)
  @Roles("ADMIN")
  @Get('alerts/inventory')
  getInventoryAlerts() {
    return this.service.getInventoryAlerts();
  }

  // =====================================================
  // 📦 INVENTORY
  // =====================================================

  // 🔹 INVENTORY SUMMARY (KPIs)
  @Roles("ADMIN")
  @Get('inventory-summary')
  getInventorySummary() {
    return this.service.getInventorySummary();
  }

  // 🔹 BROKEN INVENTORY DETAILS (optional but powerful)
//   @Get('inventory/broken')
//   getBrokenInventory() {
//     return this.service.getBrokenInventory();
//   }

  // =====================================================
  // 📈 PERFORMANCE
  // =====================================================

  // 🔹 PUROHIT PERFORMANCE
  @Roles("ADMIN")
  @Get('purohit-performance')
  getPurohitPerformance() {
    return this.service.getPurohitPerformance();
  }

  // 🔹 PUJA PERFORMANCE
  @Roles("ADMIN")
  @Get('puja-performance')
  getPujaPerformance() {
    return this.service.getPujaPerformance();
  }

  // =====================================================
  // 💰 FINANCE
  // =====================================================

  // 🔹 FINANCE SUMMARY
  @Roles("ADMIN")
  @Get('finance')
  getFinanceSummary() {
    return this.service.getFinanceSummary();
  }
}
