import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.STAFF)
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
        return this.productsService.create(dto, file);
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.STAFF)
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto, @UploadedFile() file?: Express.Multer.File) {
        return this.productsService.update(id, dto, file);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
