import {
  Request,
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  Get,
  Put,
  UseInterceptors,
  UploadedFile,
  Res,
  Delete,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegiterDto } from './dto/regiter.Dto';
import { AuthGuard } from 'src/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post('/regiter')
  async regiter(@Body() regiterDto: RegiterDto) {
    try {
      return await this.userService.regiter(regiterDto);
    } catch (error) {
      if (error.message == 'Username is already')
        throw new ConflictException(error.message);
      if (error.message == 'Wrong OTP')
        throw new UnauthorizedException(error.message);
      throw new BadRequestException(error.message);
    }
  }
  @Post('/login')
  async login(@Body() data: { Username: string; Password: string }) {
    try {
      return await this.userService.login(data.Username, data.Password);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
  @Post('/otp')
  async otp(@Body() data: { email: string }) {
    try {
      return await this.userService.otp(data.email);
    } catch {
      throw new BadRequestException('BadRequest');
    }
  }
  @Get('/forget')
  async forget(@Body() data: { email: string }) {
    try {
      return await this.userService.forget(data.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Post('editprofile')
  async edit(
    @Request() req,
    @Body() data: { name: string; interest: string[]; allergies: string[] },
  ) {
    try {
      return await this.userService.edit(
        req.user.sub,
        data.name,
        data.interest,
        data.allergies,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @UseGuards(AuthGuard)
  @Post('edit')
  async editPassword(@Request() req, @Body() data: { password: string }) {
    try {
      return await this.userService.editPassword(
        req.user.username,
        data.password,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('fridge')
  async myfridge(@Request() req) {
    try {
      return await this.userService.myfridge(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard) // Assuming AuthGuard is properly configured
  @Get('getimage')
  async getFile(@Request() req): Promise<StreamableFile> {
    try {
      const filename = await this.userService.getpic(req.user.sub);
      const fileStream = createReadStream(filename); // Assuming createReadStream is properly imported
      return new StreamableFile(fileStream);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async get(@Request() req) {
    try {
      return await this.userService.get(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Put('image')
  @UseInterceptors(FileInterceptor('img'))
  async uploadFile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    const uploadDir = './asset/img/profile';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    try {
      return res.status(200).json({
        success: true,
        message: await this.userService.img(filePath, req.user.sub),
      });
    } catch {
      
      return res
        .status(404)
        .json({ success: false, message: 'File uploaded fail' });
    }
  }

  @UseGuards(AuthGuard)
  @Post('follow')
  async follow(@Request() req, @Body() data: { uuid: string }) {
    try {
      return await this.userService.follow(req.user.sub, data.uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // @UseGuards(AuthGuard)
  // @Get('follow')
  // async getfollow(@Request() req) {
  //   try {
  //     return await this.userService.getfollow(req.user.sub);
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
  @UseGuards(AuthGuard)
  @Get('follow')
  async getfollow(@Request() req,) {
    try {
      return await this.userService.getfollow(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('follower')
  async getfollower(@Request() req) {
    try {
      return await this.userService.getfollower(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('Recipe')
  async getRecipe(@Request() req) {
    try {
      return await this.userService.getRecipe(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('UnFollow')
  async UnFollow(@Request() req, @Query('uuid') uuid: string) {
    try {
      return await this.userService.UnFollow(req.user.sub, uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('getother')
  async getother(@Request() req, @Query('uuid') uuid: string) {
    try {
      return await this.userService.get(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('remove')
  async remove(@Request() req, @Query('uuid') uuid: string) {
    if (uuid != req.user.sub)
      throw new BadRequestException('คุณไม่มีสิทธิ์');
    try {
      return await this.userService.remove(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}