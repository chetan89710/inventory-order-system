import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'Laptop' })
    @IsNotEmpty({ message: 'Product name is required' })
    @IsString({ message: 'Product name must be a string' })
    name: string;

    @ApiProperty({ example: 'High-end gaming laptop', required: false })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @ApiProperty({ example: 1200 })
    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    @Type(() => Number)
    @Min(0, { message: 'Price must be at least 0' })
    price: number;

    @ApiProperty({ example: 50 })
    @IsNotEmpty({ message: 'Stock is required' })
    @IsNumber({}, { message: 'Stock must be a number' })
    @Type(() => Number)
    @Min(0, { message: 'Stock must be at least 0' })
    stock: number;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Product image', required: false })
    @IsOptional()
    image?: Express.Multer.File;
}
