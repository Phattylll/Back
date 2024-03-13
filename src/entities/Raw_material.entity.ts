import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Ingredients } from './Ingredients.entity';
import { Add_ingredients } from './Add_ingredients.entity';
@Entity()
export class Raw_material {
  @PrimaryGeneratedColumn('uuid')
  Raw_material_ID: string;
  @Column({ type: 'float' })
  Amount: number;
  @Column()
  Nameing: string;

  @OneToMany(
    () => Ingredients,
    (ingredients: Ingredients) => ingredients.Raw_material,
  )
  @JoinTable()
  public Ingredients: Ingredients[];

  @OneToMany(
    () => Add_ingredients,
    (add_ingredients: Add_ingredients) => add_ingredients.Raw,
  )
  @JoinTable()
  public AddIng_name: Add_ingredients[];
  
}
