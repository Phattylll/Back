import { Module } from '@nestjs/common';
import { PlanerController } from './planer.controller';
import { PlanerService } from './planer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planner, Recipe, User } from 'src/entities/index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User, Planner])],
  controllers: [PlanerController],
  providers: [PlanerService],
})
export class PlanerModule {}
