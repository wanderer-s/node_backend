import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderInitDto } from './dto/orderInit.dto';
import { RecipientDto } from './dto/recipient.dto';
import { Orders } from './entities/orders.entity';
import dayjs from 'dayjs';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Orders) private ordersRepository: Repository<Orders>) {}

  async orderInit(orderInitData: OrderInitDto, userId: number) {
    const orderCount = await this.ordersRepository
      .createQueryBuilder()
      .where('Orders.userId = :userId and Orders.stage not in (:...stages)', { userId, stages: ['rejected', 'approved'] })
      .getCount();
    console.log(orderCount);
    if (orderCount >= 2) throw new BadRequestException('Cannot order more than 2');
    const { productImageUri, totalPrice, paymentDueDate } = orderInitData;
    let stage;

    if (paymentDueDate) {
      const now = dayjs();
      const dueDate = dayjs(paymentDueDate);

      const diff = dueDate.diff(now, 'days');
      if (diff > 30) throw new BadRequestException('The day must be within 30 days');

      stage = 'due_date_stage';
    } else if (totalPrice) stage = 'price_stage';
    else if (productImageUri) stage = 'url_stage';

    const order = await this.ordersRepository.save({ ...orderInitData, stage, userId });
    return { orderId: order.id };
  }

  async updateRecipient(recipientData: RecipientDto, orderId: number, userId: number) {
    const orderFound = await this.ordersRepository.findOne(orderId);
    if (orderFound.userId !== userId) throw new ForbiddenException('Invalid user access');
    await this.ordersRepository
      .createQueryBuilder()
      .update()
      .set({ recipient: recipientData, stage: 'pending' })
      .where('id = :id', { id: orderId })
      .execute();
  }

  async getOrders(userId: number, page: number, countPerPage: number) {
    const skip = (page - 1) * countPerPage;
    const totalOrderList = await this.ordersRepository.find({ userId });
    const totalCount = totalOrderList.length;
    const orderList = await this.ordersRepository.find({ where: { userId }, skip, take: countPerPage });
    const currCountPerPage = orderList.length;

    const pagination = {
      totalPage: totalCount % countPerPage > 0 ? Math.floor(totalCount / countPerPage) + 1 : totalCount / countPerPage,
      totalCount,
      page,
      countPerPage,
      currCountPerPage
    };

    return { pagination, orderList };
  }
}
