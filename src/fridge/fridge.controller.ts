import {
  Request,
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Patch,
  Param,
  Res,
  HostParam,
  Query,
  Delete,
  Get
} from '@nestjs/common';
import { FridgeService } from './fridge.service';
import { AuthGuard } from 'src/auth.guard';
import { get } from 'http';
import { userInfo } from 'os';

@Controller('Fridge')
export class FridgeController {
  constructor(private readonly fridgeService: FridgeService) { }
  @UseGuards(AuthGuard)
  @Post('create')
  async edit(@Request() req, @Body() data: { name: string }) {
    try {
      return this.fridgeService.create(data.name, req.user.sub);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('AddGuop')
  async AddGuop(
    @Request() req,
    @Body() data: { Username: string; uuid: string },
  ) {
    try {
      return this.fridgeService.AddGuop(data.Username, data.uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('Guop')
  async Guop(
    @Request() req,
    @Query('Username') Username: string,
    @Query('uuid') uuid: string,
  ) {
    try {
      return this.fridgeService.removeGuop(Username, uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('removeGuop')
  async removeGuop(
    @Request() req,
    @Query('Username') Username: string,
    @Query('uuid') uuid: string,
  ) {
    try {
      return this.fridgeService.removeGuop(Username, uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('EditGuop')
  async EditGuop(
    @Request() req,
    @Query('namegoup') namegoup: string,
    @Query('uuid') uuid: string,
  ) {
    console.log(namegoup, uuid);

    try {
      return await this.fridgeService.EditGuop(namegoup, uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
