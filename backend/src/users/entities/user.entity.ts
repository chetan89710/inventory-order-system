import { Table, Column, Model, DataType, BeforeCreate, BeforeUpdate, PrimaryKey, Default } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    STAFF = 'staff',
    CUSTOMER = 'customer',
}

export interface UserCreationAttrs {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User, UserCreationAttrs> {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare uuid: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @Column({ type: DataType.ENUM(...Object.values(UserRole)), defaultValue: UserRole.CUSTOMER })
    declare role: UserRole;

    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(user: User) {
        if (user.password && !user.password.startsWith('$2b$')) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    }
}
