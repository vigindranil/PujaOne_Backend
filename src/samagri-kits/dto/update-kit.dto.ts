import { PartialType } from "@nestjs/swagger";
import { CreateSamagriKitDto } from "./create-kit.dto";

export class UpdateSamagriKitDto extends PartialType(CreateSamagriKitDto) {}
