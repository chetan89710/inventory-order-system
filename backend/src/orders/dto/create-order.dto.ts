import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty({ example: 1, description: 'ID of the product to order' })
    @IsNumber()
    productId: number;

    @ApiProperty({ example: 2, description: 'Quantity of the product' })
    @IsNumber()
    quantity: number;

    @ApiProperty({ example: 100, description: 'Price per unit of the product' })
    @IsNumber()
    price: number;
}

export class CreateOrderDto {
    @ApiProperty({
        type: [OrderItemDto],
        example: [
            { productId: 1, quantity: 2, price: 100 },
            { productId: 2, quantity: 1, price: 250 },
        ],
        description: 'List of items in the order',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: 450, description: 'Total amount of the order' })
    @IsNumber()
    totalAmount: number;
}
