// Libraries
import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import {
  Teams,
  Posts,
  Profiles,
} from '.'

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
  // ONE TO MANY RELATIONS
  //

  @OneToMany(() => Teams, teams => teams.id)
  teams: Teams[];

  @OneToMany(() => Posts, posts => posts.id)
  posts: Posts[];

  //
  // ONE TO ONE RELATIONS
  //

  @OneToOne(() => Profiles)
  @JoinColumn()
  profile: Profiles
}
