import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsPhoneNumber, IsString } from 'class-validator';
import { GENDER_VALUES, GenderType } from 'myguardcare-affiliates-types';

export class RegisterAffiliateDto {
  @ApiProperty({
    description: 'First name of the affiliate',
    example: 'Francisco',
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the affiliate',
    example: 'Lopez',
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description:
      'Phone number of the affiliate, it always must start with "+58" country code',
    example: '+584120000000',
    required: true,
  })
  @IsString()
  @IsPhoneNumber('VE')
  phoneNumber: string;

  @ApiProperty({
    description: 'DNI of the affiliate, it must be unique',
    example: '12345678',
    required: true,
  })
  @IsString()
  dni: string;

  @ApiProperty({
    description: 'Gender of the affiliate',
    example: 'M',
    required: true,
  })
  @IsIn(GENDER_VALUES)
  gender: GenderType;

  @ApiProperty({
    description: 'Birth date of the affiliate',
    example: '1990-01-23',
    required: true,
  })
  @IsDateString()
  birthDate: Date;
}
