import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Fridge } from './Fridge.entity';
import { User } from './User.entity';
import { Raw_material } from './Raw_material.entity';
@Entity()
export class Add_ingredients {
  @PrimaryGeneratedColumn('uuid')
  Adding_ID: string;
  @Column()
  Type: string;
  @Column({ type: 'float' })
  Amount: number;
  @Column()
  Unit: string;
  @Column({ type: 'date' })
  MFG: Date;
  @Column({ type: 'date' })
  EXP: Date;
  @Column({ type: 'date' })
  AddTime: Date;
  @Column()
  NtiPeriod: number;
  // @Column()
  // Keeptheplace: string;
  @Column()
  img: string;
  @ManyToOne(() => Fridge, (fridge: Fridge) => fridge.AddIng_name)
  public Fridge: Fridge;

  @ManyToOne(() => Raw_material, (Raw: Raw_material) => Raw.AddIng_name)
  public Raw: Raw_material;
  
}
