import { PartialType } from '@nestjs/swagger';
import { CreatePujaBenefitDto } from './create-puja-benefit.dto';

export class UpdatePujaBenefitDto extends PartialType(CreatePujaBenefitDto) {}
