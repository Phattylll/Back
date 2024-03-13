import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fridge, Add_ingredients, Raw_material } from 'src/entities/index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fridge, Add_ingredients,Raw_material])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
