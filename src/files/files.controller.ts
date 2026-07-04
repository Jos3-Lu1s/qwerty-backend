import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { Auth } from '../auth/decorators';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('project/:imageName')
  findProjectImage(
    @Res() res: express.Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProjectImage(imageName);

    res.sendFile(path);
  }

  @Post('project')
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 },
    storage: diskStorage({
      destination: './static/project_images',
      filename: fileNamer
    })
  }))
  uploadProjectImg(
    @UploadedFile() file: Express.Multer.File,
  ) {

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/project/${file.filename}`;

    return { secureUrl };
  }

}
