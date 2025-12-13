import { Controller, Post, Get, Patch, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { AssignPurohitDto } from "./dto/assign-purohit.dto";
import { AddAddonDto } from "./dto/add-addon.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/guards/roles.decorator";

@ApiTags("Bookings")
@ApiBearerAuth()
@Controller("bookings")
export class BookingController {
  constructor(private service: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.service.create(dto);
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateStatusDto
  ) {
    return this.service.updateStatus(id, dto, "ADMIN");
  }

  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @Patch(":id/assign-purohit")
  assignPurohit(
    @Param("id") id: string,
    @Body() dto: AssignPurohitDto
  ) {
    return this.service.assignPurohit(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/add-addon")
  addAddon(
    @Param("id") id: string,
    @Body() dto: AddAddonDto
  ) {
    return this.service.addAddon(id, dto);
  }
}
