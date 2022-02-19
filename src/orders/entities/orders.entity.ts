import { Base } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUrl, IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum, IsObject, IsDateString } from 'class-validator';

export type stage = 'vendor_stage' | 'url_stage' | 'price_stage' | 'due_date_stage' | 'pending' | 'rejected' | 'overdue' | 'approved';

@Entity()
export class Orders extends Base {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '판매처',
    example: '네이버 스토어'
  })
  @Column('varchar', { length: 100 })
  vendor: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    description: '상품 이미지 URI'
  })
  @Column('varchar', { length: 255, name: 'product_image_uri', nullable: true })
  productImageUri: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '상품가와 배송비를 포함한 총 금액'
  })
  @Column('int', { name: 'total_price', nullable: true })
  totalPrice: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: '결제 예정일'
  })
  @Column('date', { name: 'payment_due_date', nullable: true })
  paymentDueDate: Date;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: '수령인 정보'
  })
  @Column('simple-json', { default: null })
  recipient: { name: string; main: string; detail: string; contact: string };

  @IsOptional()
  @IsEnum({ stage: ['vendor_stage', 'url_stage', 'price_stage', 'due_date_stage', 'pending', 'rejected', 'overdue', 'approved'] })
  @Column({
    type: 'enum',
    enum: ['vendor_stage', 'url_stage', 'price_stage', 'due_date_stage', 'pending', 'rejected', 'overdue', 'approved'],
    default: 'vendor_stage'
  })
  stage: stage;

  @IsNotEmpty()
  @IsNumber()
  @Column('int')
  userId: number;
}
