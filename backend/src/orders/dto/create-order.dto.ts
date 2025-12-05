import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty({
        example: 'b36f8151-2f96-43ef-83e6-4c7fe707eb75',
        description: 'UUID of the product to order'
    })
    @IsUUID()
    productId: string;

    @ApiProperty({ example: 2, description: 'Quantity of the product' })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({ example: 100, description: 'Price per unit of the product' })
    @IsInt()
    @Min(0)
    price: number;
}

export class CreateOrderDto {
    @ApiProperty({
        type: [OrderItemDto],
        example: [
            { productId: 'b36f8151-2f96-43ef-83e6-4c7fe707eb75', quantity: 2, price: 100 },
            { productId: '0bdd8d73-ec65-4d4c-bf77-ffa36b27c286', quantity: 1, price: 250 },
        ],
        description: 'List of items in the order',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: 450, description: 'Total amount of the order' })
    @IsInt()
    @Min(0)
    totalAmount: number;
}
