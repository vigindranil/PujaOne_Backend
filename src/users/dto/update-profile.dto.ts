import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Amit Sharma' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'amit@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: {
      flat: '12B',
      area: 'Behala',
      city: 'Kolkata',
      pincode: '700034',
    },
  })
  @IsObject()
  address: any;

  @ApiProperty({ example: 'Home', required: false })
  @IsOptional()
  @IsString()
  address_label?: string;
}
