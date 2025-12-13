import { PartialType } from '@nestjs/swagger';
import { CreatePricingOptionDto } from './create-pricing.dto';

export class UpdatePricingOptionDto extends PartialType(CreatePricingOptionDto) {}
