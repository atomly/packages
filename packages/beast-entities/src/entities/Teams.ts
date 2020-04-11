// Libraries
import {
  Entity,
  Index,
  ManyToMany,
  RelationId,
  JoinTable,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Members } from '.';

@Index('teams_pk', ['id'], { unique: true })
@Entity('teams', { schema: 'public' })
export class Teams extends BaseEntity {
  //
  // Members FK
  //

  @ManyToMany(() => Members, members => members.teams, { cascade: true, nullable: false })
  /**
   * @JoinTable might cause errors.
   * Read: https://stackoverflow.com/a/59352784/10246377
   */
  @JoinTable()
  members: Members[];

  @RelationId((teams: Teams) => teams.members)
  membersIds: number[];

  //
  // Owner
  //

  @OneToOne(() => Members, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: Members;

  @Column({ nullable: false })
  ownerId: number;
}
