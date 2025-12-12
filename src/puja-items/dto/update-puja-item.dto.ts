import { PartialType } from '@nestjs/swagger';
import { CreatePujaItemDto } from './create-puja-item.dto';

export class UpdatePujaItemDto extends PartialType(CreatePujaItemDto) {}
