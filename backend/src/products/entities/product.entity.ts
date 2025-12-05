import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model<Product> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare uuid: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare description: string;

    @Column({ type: DataType.FLOAT, allowNull: false })
    declare price: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare stock: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare imageUrl: string;
}
