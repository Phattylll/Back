import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { Add_ingredients } from './Add_ingredients.entity';
@Entity()
export class Fridge {
  @PrimaryGeneratedColumn('uuid')
  Fridge_ID: string;
  @Column()
  NameFridge: string;

  @ManyToMany(() => User, (user: User) => user.Fridge)
  public Member: User[];

  @OneToMany(
    () => Add_ingredients,
    (add_ingredients: Add_ingredients) => add_ingredients.Fridge,
  )
  @JoinTable()
  public AddIng_name: Add_ingredients[];
}
