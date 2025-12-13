import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AssignPurohitDto {
  @ApiProperty()
  @IsUUID()
  purohit_id: string;
}
