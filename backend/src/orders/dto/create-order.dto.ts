import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty({ example: 'b36f8151-2f96-43ef-83e6-4c7fe707eb75', description: 'UUID of the product to order' })
    @IsUUID('4', { message: 'productId must be a valid UUID' })
    productId: string;

    @ApiProperty({ example: 2, description: 'Quantity of the product' })
    @IsInt({ message: 'Quantity must be an integer' })
    @Type(() => Number)
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;

    @ApiProperty({ example: 100, description: 'Price per unit of the product' })
    @IsInt({ message: 'Price must be an integer' })
    @Type(() => Number)
    @Min(0, { message: 'Price must be at least 0' })
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
    @IsArray({ message: 'Items must be an array' })
    @ArrayNotEmpty({ message: 'Order must have at least one item' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: 450, description: 'Total amount of the order' })
    @IsInt({ message: 'Total amount must be an integer' })
    @Type(() => Number)
    @Min(0, { message: 'Total amount must be at least 0' })
    totalAmount: number;
}
