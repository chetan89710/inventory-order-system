import { Table, Column, Model, ForeignKey, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Table({ tableName: 'order_items', timestamps: false })
export class OrderItem extends Model<OrderItem> {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare uuid: string;

    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID, allowNull: false })
    declare orderId: string;

    @ForeignKey(() => Product)
    @Column({ type: DataType.UUID, allowNull: false })
    declare productId: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare quantity: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    declare price: number;
}
