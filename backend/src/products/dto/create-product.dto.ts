import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer'; // ← import

export class CreateProductDto {
    @ApiProperty({ example: 'Laptop' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'High-end gaming laptop', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 1200 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    price: number;

    @ApiProperty({ example: 50 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    stock: number;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Product image', required: false })
    @IsOptional()
    image?: Express.Multer.File;
}
