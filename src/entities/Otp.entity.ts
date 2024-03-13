import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  Otp_ID: string;
  @Column()
  OTP: string;
  @Column()
  Refno: string;
}
