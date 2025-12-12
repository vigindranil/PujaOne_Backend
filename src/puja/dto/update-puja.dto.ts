import { PartialType } from '@nestjs/swagger';
import { CreatePujaDto } from './create-puja.dto';

export class UpdatePujaDto extends PartialType(CreatePujaDto) {}
