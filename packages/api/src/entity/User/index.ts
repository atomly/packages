// Libraries
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';
import { IsEmail } from 'class-validator';

// Dependencies
import { IsEmailAlreadyTaken } from './constraints';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @IsEmailAlreadyTaken({ message: 'email already taken '})
  @Column('varchar', { length: 255, unique: true })
  email: string;

  // @Length(1, 255)
  // @Column('varchar', { length: 255 })
  // firstName: string;

  @Column('text')
  password: string;
}
