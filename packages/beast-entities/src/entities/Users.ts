// Libraries
import {
  Column,
  Entity,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Members } from '.'

@Index('users_uq', ['email'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users extends BaseEntity {
  @Column('character varying', { unique: true, length: 255 })
  email: string;

  @Column('text', { name: 'password' })
  password: string;

  @Column('character varying', {
    nullable: true,
    length: 255,
  })
  firstName: string | null;

  //
  // ONE TO ONE RELATIONS
  //

  @OneToOne(() => Members)
  @JoinColumn()
  member: Members;

  @Column({ nullable: false })
  memberId: number;
}
