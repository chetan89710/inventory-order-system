import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }
    @Post()
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() dto: CreateOrderDto, @Req() req: any) {
        const order = await this.ordersService.create(dto, req.user);
        return { data: order };
    }

    @Post(':id/confirm')
    @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
    @ApiOperation({ summary: 'Confirm an order' })
    @ApiParam({ name: 'id', description: 'Order UUID' })
    @ApiResponse({ status: 200, description: 'Order confirmed successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async confirm(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        const order = await this.ordersService.confirm(id, req.user);
        return { data: order };
    }

    @Post(':id/cancel')
    @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
    @ApiOperation({ summary: 'Cancel an order' })
    @ApiParam({ name: 'id', description: 'Order UUID' })
    @ApiResponse({ status: 200, description: 'Order canceled successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async cancel(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        const order = await this.ordersService.cancel(id, req.user);
        return { data: order };
    }

    @Get('my')
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Get orders of the logged-in customer' })
    @ApiResponse({ status: 200, description: 'Returns customer orders' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findMyOrders(@Req() req: any) {
        const orders = await this.ordersService.findMyOrders(req.user.uuid);
        return { data: orders };
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Get order details by ID' })
    @ApiParam({ name: 'id', description: 'Order UUID' })
    @ApiResponse({ status: 200, description: 'Order details' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        const order = await this.ordersService.findOne(id);
        return { data: order };
    }
}
