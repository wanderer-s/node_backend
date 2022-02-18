import { ApiProperty } from '@nestjs/swagger';
import { OrderResponseDto } from './orderResponse.dto';

class Pagination {
  @ApiProperty({ description: '총 page 수', example: 4 })
  totalPage: number;

  @ApiProperty({ description: 'data 총 개수', example: 35 })
  totalCount: number;

  @ApiProperty({ description: '현재 page', default: 1 })
  page: number;

  @ApiProperty({ description: 'page당 data 개수', default: 10 })
  countPerPage: number;

  @ApiProperty({ description: '현재 page의 data 개수', default: 10 })
  currCountPe;
  rPage: number;
}
export class OrderListResponseDto {
  @ApiProperty({ type: Pagination })
  pagination;

  @ApiProperty({ type: [OrderResponseDto] })
  orderList;
}
