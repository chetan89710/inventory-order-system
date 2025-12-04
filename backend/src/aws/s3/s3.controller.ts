import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('AWS S3')
@ApiBearerAuth()
@Controller('s3')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) { }

    @Post('upload')
    @Roles(UserRole.ADMIN, UserRole.STAFF)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ description: 'Upload File', type: Object })
    async upload(@UploadedFile() file: Express.Multer.File, @Body('folder') folder: string) {
        const folderName = folder || 'general';
        return { url: await this.s3Service.uploadFile(file, folderName) };
    }
}
