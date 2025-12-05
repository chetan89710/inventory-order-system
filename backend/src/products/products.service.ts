import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { S3Service } from '../aws/s3/s3.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product) private productModel: typeof Product,
        private readonly s3Service: S3Service,
    ) { }

    async create(dto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
        let imageUrl: string | undefined;

        if (file) {
            imageUrl = await this.s3Service.uploadFile(file, 'products');
        }

        return this.productModel.create({ ...dto, imageUrl } as any);
    }

    findAll(): Promise<Product[]> {
        return this.productModel.findAll();
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productModel.findByPk(id);
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(id: number, dto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
        const product = await this.findOne(id);

        if (file) {
            product.imageUrl = await this.s3Service.uploadFile(file, 'products');
        }

        await product.update(dto);
        return product;
    }

    async remove(id: number) {
        const product = await this.productModel.findByPk(id);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await product.destroy();

        return {
            status: true,
            message: 'Product deleted successfully',
            id
        };
    }

    async updateStock(productId: number, quantityChange: number) {
        const product = await this.findOne(productId);
        product.stock += quantityChange;

        if (product.stock < 0) {
            throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }

        await product.save();
        return product;
    }
}
