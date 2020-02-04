import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
    
  @Column()
  body: string;
    
  @Column()
  timestamp: Date;
    
  @Column()
  likes: number;
    
  @Column()
  comments: number;

  @ManyToOne(() => User)
  user: User;
}
