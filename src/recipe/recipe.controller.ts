import {
  Res,
  Request,
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
  Delete,
  StreamableFile,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/regiter.Dto';
import { RecipeService } from './recipe.service';
import { AuthGuard } from 'src/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { basename, extname } from 'path';
import { diskStorage } from 'multer';
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}
  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Request() req, @Body() createRecipeDto: CreateRecipeDto) {
    try {
      createRecipeDto.User_ID = req.user.sub;
      return await this.recipeService.create(createRecipeDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Post('/EditRecipe')
  async EditRecipe(@Request() req, @Body() createRecipeDto: CreateRecipeDto) {
    try {
      return await this.recipeService.EditRecipe(createRecipeDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('getimage')
  async getFile(@Request() req,@Query('uuid') uuid: string): Promise<StreamableFile> {
    console.log(req.user);
    try {
      return await this.recipeService.getpic(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('')
  async get() {
    try {
      return await this.recipeService.get();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Put('image')
  @UseInterceptors(FileInterceptor('img'))
  async uploadFile(
    @Request() req,
    @Query('uuid') uuid: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    const uploadDir = './asset/img/recipe';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    try {
      return res.status(200).json({
        success: true,
        message: await this.recipeService.img(filePath, uuid),
      });
    } catch {
      return res
        .status(404)
        .json({ success: false, message: 'File uploaded fail' });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('RemoveRecipe')
  async Remove(@Query('uuid') uuid: string) {
    try {
      return await this.recipeService.remove(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/save')
  async save(@Request() req, @Body() data: { uuid: string }) {
    try {
      return await this.recipeService.save(req.user.sub, data.uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/save')
  async getsave(@Request() req) {
    try {
      return await this.recipeService.getsave(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('UnSave')
  async UnSave(@Request() req, @Query('uuid') uuid: string) {
    try {
      return await this.recipeService.UnSave(req.user.sub, uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/rating')
  async Rating(@Request() req, @Body() data: { uuid: string; rating: number }) {
    try {
      return await this.recipeService.Rating(
        req.user.sub,
        data.uuid,
        data.rating,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/rating')
  async getrating(@Request() req, @Query('uuid') uuid: string) {
    try {
      return await this.recipeService.getrating(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('filter')
  async Filter(@Request() req, @Body() data: { ingredients: string[]; type: string[] }) {
    try {
      return this.recipeService.Filter(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('search')
  async search(@Request() req, @Query('searching') searching: string) {
    try {
      return this.recipeService.search(searching);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('recommen')
  async recommen(@Request() req) {
    try {
      return this.recipeService.recommen(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('recommen')
  async recommen2(@Request() req,
  @Body() data: { Allogre2: string[] }) {
    console.log(data.Allogre2);
    try {
      return this.recipeService.recommen2(req.user.sub, data.Allogre2);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
