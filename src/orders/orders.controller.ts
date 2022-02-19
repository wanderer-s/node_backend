import { Body, Controller, Patch, Post, Req, UseGuards, Param, Get, Query, DefaultValuePipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { OrderInitDto } from './dto/orderInit.dto';
import { OrdersService } from './orders.service';
import { RecipientDto } from './dto/recipient.dto';
import { OrderListResponseDto } from './dto/orderListResponse.dto';

@Controller('orders')
@ApiTags('Orders')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'signin 필요'
})
@ApiInternalServerErrorResponse({
  description: '**관리자에게 문의하세요**'
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: '주문 시작'
  })
  @ApiCreatedResponse({
    schema: { type: 'object', properties: { orderId: { type: 'number', example: 1 } } }
  })
  @ApiBadRequestResponse({
    description:
      '- `Cannot order more than 2` 완료되지 않은 2개의 주문건이 있는 경우 더 이상 주문 불가\n- `The day must be within 30 days` 결제예정일이 현재일로부터 30일이 넘음'
  })
  @Post('')
  async orderInit(@Body() orderInitData: OrderInitDto, @Req() req) {
    return await this.ordersService.orderInit(orderInitData, req.user.uid);
  }

  @ApiOperation({
    summary: '임시저장했던 주문진행',
    description: '수령인 및 수령지 입력 진행 api'
  })
  @ApiParam({
    name: 'id',
    description: '주문 id'
  })
  @Patch(':id')
  async patchRecipient(@Param('id') id: number, @Body() recipientData: RecipientDto, @Req() req) {
    this.ordersService.updateRecipient(recipientData, id, req.user.uid);
  }

  @ApiOperation({
    summary: '주문 목록'
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: false,
    schema: { type: 'integer', default: 1 }
  })
  @ApiQuery({
    name: 'countPerPage',
    example: 10,
    required: false,
    schema: { type: 'integer', default: 10 }
  })
  @ApiOkResponse({
    type: OrderListResponseDto
  })
  @Get('')
  async getOrderList(
    @Req() req,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('countPerPage', new DefaultValuePipe(10)) countPerPage: number
  ) {
    return await this.ordersService.getOrders(req.user.uid, page, countPerPage);
  }
}
