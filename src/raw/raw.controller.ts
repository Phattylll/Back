import {
  Request,
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { RawService } from './raw.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('raw')
export class RawController {
  constructor(private readonly rawService: RawService) {}
  @UseGuards(AuthGuard)
  @Post()
  async AddRaw(@Request() req, @Body() data: { name: string; calory: number }) {
    if(req.user.role!=0)
        throw new UnauthorizedException('only admin');
    try {
      return this.rawService.AddRaw(data.name, data.calory);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async FetRaw(@Request() req) {
    try {
      return this.rawService.GetRaw();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
