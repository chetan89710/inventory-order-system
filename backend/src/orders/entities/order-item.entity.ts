import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Order } from './order.entity';

@Table({ tableName: 'order_items', timestamps: false })
export class OrderItem extends Model<OrderItem> {
    @Column
    productId: number;

    @Column
    quantity: number;

    @Column
    price: number;

    @ForeignKey(() => Order)
    @Column
    orderId: number;
}
