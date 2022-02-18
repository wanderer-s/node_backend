import { Base } from '../../common/entities/base.entity';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Users extends Base {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: '사용자 email',
    example: 'test@gmail.com',
  })
  @Column('varchar', { length: 200, unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '사용자 nickname',
    example: 'test',
  })
  @Column('varchar', { length: 100, unique: true })
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '비밀번호 8~20자(`숫자`, `문자`, `특수문자` 최소 1개씩 포함)',
  })
  @Column({ select: false })
  password: string;

  @DeleteDateColumn({ name: 'deactivated_at' })
  deactivatedAt?: Date;
}
