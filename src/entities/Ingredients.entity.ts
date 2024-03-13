import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe.entity';
import { Raw_material } from './Raw_material.entity';
@Entity()
export class Ingredients {
  @PrimaryGeneratedColumn('uuid')
  Ingredients_ID: string;

  @Column({ type: 'float' })
  Amount: number;

  @ManyToOne(() => Recipe, (recipe: Recipe) => recipe.Ingredients)
  public Recipe: Recipe;

  @ManyToOne(
    () => Raw_material,
    (raw_material: Raw_material) => raw_material.Ingredients,
  )
  public Raw_material: Raw_material;
}
