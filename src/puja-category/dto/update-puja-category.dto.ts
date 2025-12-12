import { PartialType } from '@nestjs/swagger';
import { CreatePujaCategoryDto } from './create-puja-category.dto';

export class UpdatePujaCategoryDto extends PartialType(CreatePujaCategoryDto) {}
