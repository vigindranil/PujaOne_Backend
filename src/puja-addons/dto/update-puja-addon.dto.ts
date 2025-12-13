import { PartialType } from '@nestjs/swagger';
import { CreatePujaAddonDto } from './create-puja-addon.dto';

export class UpdatePujaAddonDto extends PartialType(CreatePujaAddonDto) {}
