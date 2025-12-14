import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreatePaymentOrderDto {
  @ApiProperty()
  @IsUUID()
  booking_id: string;
}
