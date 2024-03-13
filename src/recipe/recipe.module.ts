import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Add_ingredients,
  Ingredients,
  Rating,
  Raw_material,
  Recipe,
  User,
} from 'src/entities/index.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Raw_material, Ingredients, User, Rating,Add_ingredients]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
