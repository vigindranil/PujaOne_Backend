import { PartialType } from "@nestjs/swagger";
import { AddKitItemDto } from "./add-kit-item.dto";

export class UpdateKitItemDto extends PartialType(AddKitItemDto) {}
