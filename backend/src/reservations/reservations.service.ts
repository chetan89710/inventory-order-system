import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ReservationsService {
    private readonly logger = new Logger(ReservationsService.name);

    constructor(private readonly ordersService: OrdersService) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        try {
            const expiredCount = await this.ordersService.expireOrders();
            this.logger.log(`Cron executed: expired ${expiredCount} orders`);
        } catch (error) {
            this.logger.error('Cron failed', error);
        }
    }
}