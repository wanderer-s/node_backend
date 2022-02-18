import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '현재 비밀번호'
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '변경할 비밀번호 (8~20자 문자, 숫자, 특수문자 최소 1개 포함)'
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '변경할 비밀번호 확인'
  })
  newPasswordCheck: string;
}
