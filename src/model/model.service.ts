import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ModelService {
  constructor(private readonly httpService: HttpService) {}
  async sendimg(filePath: string, Path: string) {
    console.log(
      `http://161.246.5.159:7501/${Path}-api`,
//edit
    );
    const url = `${process.cwd()}/${filePath}`;
    console.log(url);
    console.log(process.cwd());
    console.log(filePath);
    const data = await this.httpService
      .post(`http://161.246.5.159:7501/${Path}-api`, {
//edit
        img_path: url,
      })
      .toPromise();
    return { data: data.data };
  }
}
//http://161.246.5.159:7501/obj-api
// console.log(res);
//
