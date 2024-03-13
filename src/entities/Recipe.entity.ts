import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { Planner } from './Planner.entity';
import { Ingredients } from './Ingredients.entity';
import { Rating } from './Rating.entity';
@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  Recipe_ID: string;
  @Column()
  Recipe_name: string;
  @Column('simple-array', { nullable: true })
  Category: string[];
  @Column()
  Method: string;
  @Column()
  CookingTime: number;
  @Column({ default: 'c0b611acf5252dfb8b20c0ca1e4888fe.png' })
  Image: string;
  @Column({ type: 'float', default: 0 })
  Colorie: number;

  @OneToMany(() => Rating, (rating: Rating) => rating.Recipe)
  @JoinTable()
  public Ratings: Rating[];

  @ManyToMany(() => User, (user: User) => user.Save)
  public Save: User[];
  @ManyToOne(() => User, (user: User) => user.PostRecipe)
  public Username_ID: User;
  @ManyToMany(() => Planner, (planner: Planner) => planner.Recipe)
  @JoinTable()
  public Planner: Planner[];
  @OneToMany(
    () => Ingredients,
    (ingredients: Ingredients) => ingredients.Recipe,
  )
  @JoinTable()
  public Ingredients: Ingredients[];
}
