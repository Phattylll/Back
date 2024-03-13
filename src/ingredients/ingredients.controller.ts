import {
  Request,
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { AuthGuard } from 'src/auth.guard';
import { IngredientsDto } from './dto/ingredient.Dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}
  @UseGuards(AuthGuard)
  @Post('add')
  async add(@Request() req, @Body() data: IngredientsDto) {
    try {
      return this.ingredientsService.add(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('edit')
  async edit(@Request() req, @Body() data: IngredientsDto) {
    try {
      return this.ingredientsService.edit(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('remove')
  async removeGuop(@Request() req, @Query('uudiIngredients') uuid: string) {
    try {
      return this.ingredientsService.remov(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('search')
  async search(@Request() req, @Query('searching') searching: string, @Query('uuid') uuid: string) {
    try {
      return this.ingredientsService.search(searching,uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
