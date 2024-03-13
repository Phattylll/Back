import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SendimgDto } from './dto/sendimg.Dto';
import { ModelService } from './model.service';
import { FileInterceptor } from '@nestjs/platform-express';

import * as fs from 'fs';
import * as path from 'path';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}
  @Put('obj')
  @UseInterceptors(FileInterceptor('img'))
  async uploadFileobj(@UploadedFile() file: Express.Multer.File, @Res() res) {
    console.log('555');
    const uploadDir = './asset/img/model';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    console.log(filePath);
    fs.writeFileSync(filePath, file.buffer);
    try {
      return res.status(200).json({
        success: true,
        message: await this.modelService.sendimg(filePath, 'obj'),
        //edit
      });
    } catch (error) {
      return res
        .status(404)
        .json({ success: false, message: 'File uploaded fail obj', error });
    }
  }

  @Put('exp')
  @UseInterceptors(FileInterceptor('img'))
  async uploadFileexp(@UploadedFile() file: Express.Multer.File, @Res() res) {
    const uploadDir = './asset/img/model';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    try {
      return res.status(200).json({
        success: true,
        message: await this.modelService.sendimg(filePath, 'exp'),
        //edit
      });
    } catch {
      return res
        .status(404)
        .json({ success: false, message: 'File uploaded fail exp' });
    }
  }
}
