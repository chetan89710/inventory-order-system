import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { OrdersModule } from '../orders/orders.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        OrdersModule,
        ScheduleModule.forRoot()
    ],
    providers: [ReservationsService],
})
export class ReservationsModule { }
