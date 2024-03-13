import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe.entity';
import { Raw_material } from './Raw_material.entity';
import { User } from './User.entity';
@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  Rating_ID: string;

  @Column({ type: 'float', default: 0 })
  Rating: number;

  @ManyToOne(() => Recipe, (recipe: Recipe) => recipe.Ratings)
  public Recipe: Recipe;

  @ManyToOne(() => User, (user: User) => user.Ratings)
  public User: User;
}
