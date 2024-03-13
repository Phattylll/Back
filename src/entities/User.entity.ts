import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Recipe } from './Recipe.entity';
import { Planner } from './Planner.entity';
import { Fridge } from './Fridge.entity';
import { Rating } from './Rating.entity';
import { Follow } from './Follow.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  User_ID: string;
  @Column()
  UserName: string;
  @Column({ nullable: true })
  Name: string;
  @Column()
  Email: string;
  @Column()
  Password: string;
  @Column({ default: `${process.cwd()}\\asset\\img\\profile\\default.jpg` })
  Image: string;
  @Column('timestamp')
  TimeAT: Date;
  @Column('simple-array', { nullable: true })
  Interest: string[];
  @Column('simple-array', { nullable: true })
  Allogre: string[];
  @Column({ default: 1 })
  Role: number;

  @OneToMany(() => Follow, (follow: Follow) => follow.Follow)
  @JoinTable()
  public Follow: User[];

  @OneToMany(() => Follow, (follow: Follow) => follow.Follower)
  @JoinTable()
  public Follower: User[];

  @ManyToMany(() => Recipe, (recipe: Recipe) => recipe.Save)
  @JoinTable()
  public Save: Recipe[];

  @OneToMany(() => Planner, (planner: Planner) => planner.User)
  @JoinTable()
  public Planner: Planner[];

  @ManyToMany(() => Fridge, (fridge: Fridge) => fridge.Member)
  @JoinTable()
  public Fridge: Fridge[];

  @OneToMany(() => Recipe, (recipe: Recipe) => recipe.Username_ID)
  @JoinTable()
  public PostRecipe: Recipe[];

  @OneToMany(() => Rating, (rating: Rating) => rating.User)
  @JoinTable()
  public Ratings: Rating[];
}
