// Libraries
import { Entity, Index, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Users } from '.';

@Index('teams_pk', ['id'], { unique: true })
@Entity('teams', { schema: 'public' })
export class Teams extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  //
  // User FK
  //

  @ManyToOne(() => Users, user => user.teams, { onDelete: 'CASCADE' })
  user: Users;

  @Column()
  userId: number;
}
