import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { FileUploadOptions } from "./file-upload-options.interface";

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client
  private readonly s3Region = 'eu-north-1'
  constructor(private readonly configService: ConfigService) {
    const accessKeyId = configService.get('AWS_ACCESS_KEY')
    const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY')

    const s3Config: S3ClientConfig = {
      region: this.s3Region
    }

    if(accessKeyId && secretAccessKey) {
      s3Config.credentials = {
        accessKeyId,
        secretAccessKey
      }
    }

    this.s3Client = new S3Client(s3Config)
  }

  async upload({ bucket, key, file }: FileUploadOptions) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file
      })
    )
  }

  getFileUrl(bucket: string, key: string) {
    return `https://${bucket}.s3.${this.s3Region}.amazonaws.com/${key}`
  }
}