// Libraries
import {
  Entity,
  OneToOne,
  OneToMany,
  ManyToMany,
  Column,
  JoinColumn,
  RelationId,
  JoinTable,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity';
import { Teams, Posts, Profiles } from '.';

@Entity('members', { schema: 'public' })
export class Members extends BaseEntity {
  //
  // ONE TO ONE RELATIONS
  //

  @OneToOne(() => Profiles)
  @JoinColumn()
  profile: Profiles;

  @Column({ nullable: false })
  profileId: number;

  //
  // ONE TO MANY RELATIONS
  //

  @OneToMany(() => Posts, posts => posts.member)
  @JoinColumn()
  posts: Posts[];

  @RelationId((members: Members) => members.posts)
  postsIds: number[];

  //
  // MANY TO MANY RELATIONS
  //

  @ManyToMany(() => Members, undefined, { cascade: true, nullable: false })
  /**
   * @JoinTable might cause errors.
   * Read: https://stackoverflow.com/a/59352784/10246377
   */
  @JoinTable()
  teams: Teams[];

  @RelationId((members: Members) => members.teams)
  teamsIds: number[];
}
