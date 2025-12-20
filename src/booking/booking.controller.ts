import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { AssignPurohitDto } from "./dto/assign-purohit.dto";
import { AddAddonDto } from "./dto/add-addon.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { ProfileCompleteGuard } from "../auth/guards/profile-complete.guard";

@ApiTags("Bookings")
@ApiBearerAuth()
@Controller("bookings")
export class BookingController {
  constructor(private readonly service: BookingService) {}

  // =================================================
  // 👤 USER: CREATE BOOKING (PACKAGE / CUSTOM)
  // =================================================
  @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
  @Post()
  @ApiOperation({
    summary: "User: Create booking (supports package or custom)",
  })
  create(@Req() req, @Body() dto: CreateBookingDto) {
    return this.service.create(req.user.id, dto);
  }

  // =================================================
  // 👤 USER / 👑 ADMIN: VIEW SINGLE BOOKING
  // =================================================
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "View booking details" })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  // =================================================
  // 👑 ADMIN: VIEW ALL BOOKINGS
  // =================================================
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Admin: list all bookings" })
  findAll() {
    return this.service.findAll();
  }

  // =================================================
  // 👑 ADMIN: UPDATE BOOKING STATUS
  // =================================================
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  @ApiOperation({ summary: "Admin: update booking status" })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateStatusDto,
    @Req() req,
  ) {
    return this.service.updateStatus(id, dto, req.user.id);
  }

  // =================================================
  // 👑 ADMIN: ASSIGN PUROHIT
  // =================================================
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @Patch(":id/assign-purohit")
  @ApiOperation({ summary: "Admin: assign purohit to booking" })
  assignPurohit(
    @Param("id") id: string,
    @Body() dto: AssignPurohitDto,
  ) {
    return this.service.assignPurohit(id, dto);
  }

  // =================================================
  // 👤 USER: ADD CUSTOM ADDON (AFTER BOOKING)
  // =================================================
  @UseGuards(JwtAuthGuard)
  @Patch(":id/add-addon")
  @ApiOperation({ summary: "User: add custom addon to booking" })
  addAddon(
    @Param("id") id: string,
    @Body() dto: AddAddonDto,
  ) {
    return this.service.addAddon(id, dto);
  }

  // =================================================
  // 👤 USER: CANCEL BOOKING
  // =================================================
  @UseGuards(JwtAuthGuard)
  @Post(":id/cancel")
  @ApiOperation({ summary: "User: request booking cancellation" })
  cancelBooking(
    @Param("id") bookingId: string,
    @Body() body: { reason?: string },
  ) {
    return this.service.requestCancellation(
      bookingId,
      body.reason,
    );
  }
}
