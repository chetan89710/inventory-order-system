import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    create(@Body() dto: CreateOrderDto, @Req() req: any) {
        return this.ordersService.create(dto, req.user);
    }

    @Post(':id/confirm')
    @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
    confirm(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        return this.ordersService.confirm(id, req.user);
    }

    @Post(':id/cancel')
    @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
    cancel(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
        return this.ordersService.cancel(id, req.user);
    }

    @Get('my')
    @Roles(UserRole.CUSTOMER)
    findMyOrders(@Req() req: any) {
        return this.ordersService.findMyOrders(req.user.uuid);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ordersService.findOne(id);
    }
}
