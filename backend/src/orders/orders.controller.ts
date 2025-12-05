import { Body, Controller, Get, Param, Post, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { Order } from './entities/order.entity';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
        return this.ordersService.create(
            { ...createOrderDto, userEmail: req.user.email },
            req.user,
        );
    }

    @Post(':id/confirm')
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Confirm my own order' })
    @ApiResponse({ status: 200, description: 'Order confirmed' })
    confirm(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        if (!req.user?.email) throw new ForbiddenException('User email not found in JWT');
        return this.ordersService.confirm(id, req.user.email);
    }

    @Post(':id/cancel')
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Cancel an order' })
    @ApiResponse({ status: 200, description: 'Order cancelled' })
    cancel(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ordersService.cancel(id);
    }

    @Get('my')
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Get logged-in user orders' })
    @ApiResponse({ status: 200, description: 'List of orders' })
    findMyOrders(@Req() req: any) {
        return this.ordersService.findMyOrders(req.user.email);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Get order by ID' })
    @ApiResponse({ status: 200, description: 'Order details' })
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ordersService.findOne(id);
    }
}
