import { Module } from '@nestjs/common';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { Add_ingredients } from 'src/entities/index.entity';

@Module({
  imports: [HttpModule],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
