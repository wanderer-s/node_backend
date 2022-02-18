import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'data 생성 일시' })
  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @ApiProperty({ description: 'data 수정 일시' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
