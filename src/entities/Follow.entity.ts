import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './User.entity';
@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  Follow_ID: string;
  @Column()
  id_follow: string;
  @Column()
  id_follower: string;
  @ManyToOne(() => User, (user: User) => user.Follow)
  public Follow: User;

  @ManyToOne(() => User, (user: User) => user.Follower)
  public Follower: User;

}
