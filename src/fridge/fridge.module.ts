import { Module } from '@nestjs/common';
import { FridgeController } from './fridge.controller';
import { FridgeService } from './fridge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fridge, User } from 'src/entities/index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fridge, User])],
  controllers: [FridgeController],
  providers: [FridgeService],
})
export class FridgeModule {}
