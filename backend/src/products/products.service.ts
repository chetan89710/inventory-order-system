import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { S3Service } from '../aws/s3/s3.service';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product) private productModel: typeof Product, private readonly s3Service: S3Service) { }

    async create(dto: CreateProductDto, file?: Express.Multer.File) {
        const imageUrl = file ? await this.s3Service.uploadFile(file, 'products') : null;
        const product = await this.productModel.create({ ...dto, imageUrl } as any);
        return { statusCode: 201, message: 'Product created successfully', data: product };
    }

    async findAll() {
        const products = await this.productModel.findAll();
        return { statusCode: 200, message: 'Products fetched successfully', data: products };
    }

    async findOne(uuid: string) {
        const product = await this.productModel.findByPk(uuid);
        if (!product) throw new NotFoundException('Product not found');
        return { statusCode: 200, message: 'Product fetched successfully', data: product };
    }

    async update(uuid: string, dto: UpdateProductDto, file?: Express.Multer.File) {
        const product = (await this.findOne(uuid)).data;
        if (file) product.imageUrl = await this.s3Service.uploadFile(file, 'products');
        await product.update(dto);
        return { statusCode: 200, message: 'Product updated successfully', data: product };
    }

    async remove(uuid: string) {
        const product = (await this.findOne(uuid)).data;
        await product.destroy();
        return { statusCode: 200, message: 'Product deleted successfully', data: { id: uuid } };
    }

    async updateStock(productUuid: string, quantityChange: number) {
        const product = (await this.findOne(productUuid)).data;
        product.stock += quantityChange;
        if (product.stock < 0) throw new BadRequestException(`Insufficient stock for ${product.name}`);
        await product.save();
        return { statusCode: 200, message: 'Stock updated successfully', data: product };
    }
}
