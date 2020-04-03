// Libraries
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Users } from '.';

@Index('post_pk', ['id'], { unique: true })
@Entity('posts', { schema: 'public' })
export class Posts extends BaseEntity {
  @Column('text')
  header: string;

  @Column('text')
  body: string;

  //
  // User FK
  //

  @ManyToOne(() => Users, undefined, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ referencedColumnName: 'id' })
  user: number;

  @Column({ nullable: false })
  userId: number;
}
