// Libraries
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  header: string;

  @Column('text')
  body: string;
}
