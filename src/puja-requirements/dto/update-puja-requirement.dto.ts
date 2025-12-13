import { PartialType } from '@nestjs/swagger';
import { CreatePujaRequirementDto } from './create-puja-requirement.dto';

export class UpdatePujaRequirementDto extends PartialType(CreatePujaRequirementDto) {}
