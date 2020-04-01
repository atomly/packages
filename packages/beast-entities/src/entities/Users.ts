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
  Players,
  Recruiters,
} from '.'

@Index('users_uq', ['email'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users extends BaseEntity {
  @Column('character varying', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('text', { name: 'password' })
  password: string;

  @Column('character varying', {
    name: 'first_name',
    nullable: true,
    length: 255,
  })
  firstName: string | null;

  //
  // ONE TO MANY RELATIONS
  //

  @OneToMany(() => Teams, teams => teams.user)
  teams: Teams[];

  @OneToMany(() => Posts, posts => posts.user)
  posts: Posts[];

  //
  // ONE TO ONE RELATIONS
  //

  @OneToOne(() => Players)
  @JoinColumn()
  player: Players

  @OneToOne(() => Recruiters)
  @JoinColumn()
  recruiter: Recruiters

  @OneToOne(() => Profiles)
  @JoinColumn()
  profile: Profiles
}
