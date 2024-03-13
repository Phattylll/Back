import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Recipe } from './Recipe.entity';
import { User } from './User.entity';
@Entity()
export class Planner {
  @PrimaryGeneratedColumn('uuid')
  Planner_ID: string;
  @Column()
  period: number;
  @Column()
  CreateTime: Date;
  @Column({ type: 'date' })
  timeAdd: Date;
  @ManyToOne(() => User, (user: User) => user.Planner)
  public User: User;

  @ManyToMany(() => Recipe, (recipe: Recipe) => recipe.Planner)
  public Recipe: Recipe[];
}
