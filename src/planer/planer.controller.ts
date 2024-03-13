import {
  Request,
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { PlanerService } from './planer.service';
import { AuthGuard } from 'src/auth.guard';
import { CreatePlanerDto } from './dto/planer.Dto';

@Controller('planner')
export class PlanerController {
  constructor(private readonly planerServiceService: PlanerService) {}

  @Post('/plannerCreate')
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() createPlanerDto: CreatePlanerDto) {
    try {
      createPlanerDto.uuidUser = req.user.sub;
      return await this.planerServiceService.create(createPlanerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('')
  @UseGuards(AuthGuard)
  async Get(@Request() req) {
    try {
      return await this.planerServiceService.get(req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/plannerEdit')
  async plannerEdit(@Request() req, @Body() createPlanerDto: CreatePlanerDto) {
    try {
      return await this.planerServiceService.plannerEdit(createPlanerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('plannerRemove')
  async Remove(@Query('uuidplanner') uuidplanner: string) {
    try {
      return await this.planerServiceService.remove(uuidplanner);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
