// Libraries
import {
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Users } from '.';

@Index('teams_pk', ['id'], { unique: true })
@Entity('teams', { schema: 'public' })
export class Teams extends BaseEntity {
  //
  // User FK
  //

  @ManyToOne(() => Users, undefined, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ referencedColumnName: 'id' })
  user: number;

  @Column({ nullable: false })
  userId: number;
}
