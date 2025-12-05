import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from './entities/order.entity';
import { ProductsService } from '../products/products.service';
import { Op } from 'sequelize';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private orderModel: typeof Order,
        private readonly productsService: ProductsService,
    ) { }

    private normalizeItems(items: any) {
        return Array.isArray(items) ? items : JSON.parse(items);
    }

    // CREATE ORDER (RESERVED)
    async create(data: any, user: any): Promise<Order> {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        const items = this.normalizeItems(data.items);

        // Validate stock for each item
        for (const item of items) {
            const product = await this.productsService.findOne(item.productId);
            if (!product) throw new BadRequestException(`Product with ID ${item.productId} not found`);
            if (product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }

        const order = await this.orderModel.create({
            userEmail: user.email.trim().toLowerCase(),
            items: items,
            totalAmount: data.totalAmount,
            status: OrderStatus.RESERVED,
            expiresAt,
        } as any);

        return order;
    }

    // FIND ONE ORDER BY ID
    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel.findByPk(id);
        if (!order) throw new NotFoundException(`Order #${id} not found`);
        return order;
    }

    // GET ORDERS OF LOGGED-IN USER
    async findMyOrders(userEmail: string): Promise<Order[]> {
        return this.orderModel.findAll({
            where: { userEmail: userEmail.trim().toLowerCase() },
            order: [['createdAt', 'DESC']],
        });
    }

    // CONFIRM ORDER
    async confirm(id: string, userEmail: string): Promise<Order> {
        const order = await this.findOne(id);

        if (order.userEmail.trim().toLowerCase() !== userEmail.trim().toLowerCase()) {
            throw new ForbiddenException('You can only confirm your own orders');
        }

        if (order.status !== OrderStatus.RESERVED) {
            throw new ForbiddenException('Order can only be confirmed if it is reserved');
        }

        order.status = OrderStatus.CONFIRMED;
        await order.save();
        return order;
    }

    // CANCEL ORDER
    async cancel(id: string): Promise<Order> {
        const order = await this.findOne(id);

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

    // EXPIRE ORDERS (CRON)
    async expireOrders() {
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
