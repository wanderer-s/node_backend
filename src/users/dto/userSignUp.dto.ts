import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from '../entities/users.entity';

export class UserSignUpDto extends PickType(Users, ['email', 'nickname', 'password'] as const) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '비밀번호 확인' })
  passwordCheck: string;
}
