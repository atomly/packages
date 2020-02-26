// Libraries
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';
import { IsString } from 'class-validator';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Check max/min lengths, validate, and check for inappropriate content.
  @IsString()
  @Column('text', { nullable: false })
  header: string;

  // TODO: Check max/min lengths, validate, and check for inappropriate content.
  @IsString()
  @Column('text', { nullable: false })
  body: string;
}
