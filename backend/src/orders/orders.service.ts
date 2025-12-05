import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from './entities/order.entity';
import { ProductsService } from '../products/products.service';
import { Op } from 'sequelize';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private orderModel: typeof Order,
        private readonly productsService: ProductsService,
    ) { }

    private normalizeItems(items: any) {
        return Array.isArray(items) ? items : JSON.parse(items);
    }

    async create(data: any, user: any): Promise<Order> {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        const items = this.normalizeItems(data.items);
        if (!items || !items.length) {
            throw new BadRequestException('Order must have at least one item');
        }

        for (const item of items) {
            const product = await this.productsService.findOne(item.productId);
            if (!product)
                throw new BadRequestException(`Product with ID ${item.productId} not found`);
            if (product.stock < item.quantity)
                throw new BadRequestException(`Insufficient stock for ${product.name}`);

            await this.productsService.updateStock(item.productId, -item.quantity);
        }

        const userId = user.uuid || user.id;

        const order = await this.orderModel.create({
            userId,
            items,
            totalAmount: data.totalAmount,
            status: OrderStatus.RESERVED,
            expiresAt,
        } as any);

        return order;
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel.findOne({ where: { uuid: id } });
        if (!order) throw new NotFoundException(`Order #${id} not found`);
        return order;
    }

    async findMyOrders(userId: string): Promise<Order[]> {
        return this.orderModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
    }

    async confirm(id: string, currentUser: any): Promise<Order> {
        const order = await this.findOne(id);

        if (currentUser.role === UserRole.CUSTOMER && order.userId !== currentUser.uuid) {
            throw new ForbiddenException('You can only confirm your own orders');
        }

        if (order.status !== OrderStatus.RESERVED) {
            throw new ForbiddenException('Order can only be confirmed if it is reserved');
        }

        order.status = OrderStatus.CONFIRMED;
        await order.save();
        return order;
    }

    async cancel(id: string, currentUser: any): Promise<Order> {
        const order = await this.findOne(id);

        if (currentUser.role === UserRole.CUSTOMER && order.userId !== currentUser.uuid) {
            throw new ForbiddenException('You can only cancel your own orders');
        }

        if (order.status !== OrderStatus.RESERVED) {
            throw new ForbiddenException('Only reserved orders can be cancelled');
        }

        const items = this.normalizeItems(order.items);
        for (const item of items) {
            await this.productsService.updateStock(item.productId, item.quantity);
        }

        order.status = OrderStatus.CANCELLED;
        await order.save();
        return order;
    }

    async expireOrders(): Promise<number> {
        const now = new Date();
        const expiredOrders = await this.orderModel.findAll({
            where: {
                status: OrderStatus.RESERVED,
                expiresAt: { [Op.lte]: now },
            },
        });

        for (const order of expiredOrders) {
            const items = this.normalizeItems(order.items);
            for (const item of items) {
                await this.productsService.updateStock(item.productId, item.quantity);
            }
            order.status = OrderStatus.EXPIRED;
            await order.save();
        }

        return expiredOrders.length;
    }
}
