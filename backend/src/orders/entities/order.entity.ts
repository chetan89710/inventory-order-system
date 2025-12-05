import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
    RESERVED = 'reserved',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare uuid: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @Column({ type: DataType.JSON, allowNull: false })
    declare items: { productId: string; quantity: number; price: number }[];

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare totalAmount: number;

    @Column({
        type: DataType.ENUM(...Object.values(OrderStatus)),
        allowNull: false,
        defaultValue: OrderStatus.RESERVED,
    })
    declare status: OrderStatus;

    @Column({ type: DataType.DATE, allowNull: false })
    declare expiresAt: Date;
}
