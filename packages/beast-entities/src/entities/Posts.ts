// Libraries
import { Column, Entity, Index, ManyToOne } from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Users } from '.';

@Index('post_pk', ['id'], { unique: true })
@Entity('posts', { schema: 'public' })
export class Posts extends BaseEntity {
  @Column('text', { name: 'header' })
  header: string;

  @Column('text', { name: 'body' })
  body: string;

  //
  // User FK
  //

  @ManyToOne(() => Users, user => user.posts, { onDelete: 'CASCADE' })
  user: Users;

  @Column()
  userId: number;
}
