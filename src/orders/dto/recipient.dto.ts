import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class RecipientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '수령인'
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '수령인 기본 주소'
  })
  main: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '수령인 상세 주소'
  })
  detail: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    description: '수령인 연락처'
  })
  contact: string;
}
