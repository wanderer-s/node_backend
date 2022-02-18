import { ApiProperty } from '@nestjs/swagger';
import { OrderInitDto } from './orderInit.dto';
import { RecipientDto } from './recipient.dto';

export class OrderResponseDto extends OrderInitDto {
  @ApiProperty({
    description: '주문 id'
  })
  id: number;

  @ApiProperty({ type: RecipientDto })
  recipient;

  @ApiProperty({
    description: '주문단계 상태',
    type: 'enum',
    enum: ['vendor_stage', 'url_stage', 'price_stage', 'due_date_stage', 'pending', 'rejected', 'overdue', 'approved'],
    default: 'vendor_stage'
  })
  stage: string;

  @ApiProperty({
    description: '주문한 사용자 id'
  })
  userId: number;
}
