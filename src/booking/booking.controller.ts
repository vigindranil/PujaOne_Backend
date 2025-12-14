import { Controller, Post, Get, Patch, Param, Body } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { AssignPurohitDto } from "./dto/assign-purohit.dto";
import { AddAddonDto } from "./dto/add-addon.dto";
import { CalculatePriceDto } from "./dto/calculate-price.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { UseGuards } from "@nestjs/common";

@ApiTags("Bookings")
@ApiBearerAuth()
@Controller("bookings")
export class BookingController {
  constructor(private service: BookingService) {}

  // 👤 USER CREATE BOOKING
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.service.create(dto);
  }

  // 👑 ADMIN VIEW ALL
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 👤 USER / ADMIN VIEW ONE
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  // 👑 ADMIN UPDATE STATUS
  @Roles("ADMIN")
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateStatusDto
  ) {
    return this.service.updateStatus(id, dto, "ADMIN");
  }

  // 👑 ADMIN ASSIGN PUROHIT
  @Roles("ADMIN")
  @Patch(":id/assign-purohit")
  assignPurohit(
    @Param("id") id: string,
    @Body() dto: AssignPurohitDto
  ) {
    return this.service.assignPurohit(id, dto);
  }

  // 👤 USER ADD ADDON
  @UseGuards(JwtAuthGuard)
  @Patch(":id/add-addon")
  addAddon(
    @Param("id") id: string,
    @Body() dto: AddAddonDto
  ) {
    return this.service.addAddon(id, dto);
  }

  // 🧮 PUBLIC PRICE CALCULATION
  
  @Post("calculate-price")
  calculate(@Body() dto: CalculatePriceDto) {
    return this.service.calculatePrice(dto);
  }
    @Post(':id/cancel')
    @UseGuards(JwtAuthGuard)
    cancelBooking(
    @Param('id') bookingId: string,
    @Body() body: { reason?: string }
    ) {
    return this.service.requestCancellation(bookingId, body.reason);
    }

}
