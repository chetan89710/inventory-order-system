// src/aws/s3/s3.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private bucketName: string;
    private region: string;

    constructor(private readonly configService: ConfigService) {
        const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
        const region = this.configService.get<string>('AWS_REGION');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

        if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
            throw new Error('AWS S3 configuration is missing in .env');
        }

        this.bucketName = bucketName;
        this.region = region;

        this.s3 = new S3Client({
            region: this.region,
            credentials: { accessKeyId, secretAccessKey },
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const fileName = `${folder}/${uuidv4()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3.send(command);

        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    }
}
