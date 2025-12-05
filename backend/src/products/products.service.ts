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
        const imageUrl = file ? await this.s3Service.uploadFile(file, 'products') : null;
        return this.productModel.create({ ...dto, imageUrl } as any);
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.findAll();
    }

    async findOne(uuid: string): Promise<Product> {
        const product = await this.productModel.findByPk(uuid);
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(uuid: string, dto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
        const product = await this.findOne(uuid);
        if (file) {
            product.imageUrl = await this.s3Service.uploadFile(file, 'products');
        }
        return product.update(dto);
    }

    async remove(uuid: string) {
        const product = await this.findOne(uuid);
        await product.destroy();
        return { status: true, message: 'Product deleted successfully', id: uuid };
    }

    async updateStock(productUuid: string, quantityChange: number) {
        const product = await this.findOne(productUuid);
        product.stock += quantityChange;
        if (product.stock < 0) throw new BadRequestException(`Insufficient stock for ${product.name}`);
        await product.save();
        return product;
    }
}
