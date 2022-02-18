import { OmitType } from '@nestjs/swagger';
import { Orders } from '../entities/orders.entity';

export class OrderInitDto extends OmitType(Orders, ['createdAt', 'updatedAt', 'stage', 'userId', 'id'] as const) {}
