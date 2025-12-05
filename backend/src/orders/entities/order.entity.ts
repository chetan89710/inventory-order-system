import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
    RESERVED = 'reserved',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID })
    declare id: string; // <-- use 'declare' to avoid overwriting Model.id

    @Column({ type: DataType.STRING, allowNull: false })
    declare userEmail: string;

    @Column({ type: DataType.JSON, allowNull: false })
    declare items: { productId: number; quantity: number; price: number }[];

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare totalAmount: number;

    @Column({
        type: DataType.ENUM('reserved', 'confirmed', 'cancelled', 'expired'),
        allowNull: false,
        defaultValue: OrderStatus.RESERVED,
    })
    declare status: OrderStatus;

    @Column({ type: DataType.DATE, allowNull: false })
    declare expiresAt: Date;
}
