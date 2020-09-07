// Libraries
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Members } from './Members';

@Index('post_pk', ['id'], { unique: true })
@Entity('posts', { schema: 'public' })
export class Posts extends BaseEntity {
  @Column('text')
  header: string;

  @Column('text')
  body: string;

  //
  // Members FK
  //

  @ManyToOne(() => Members, undefined, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ referencedColumnName: 'id' })
  member: Members;

  @Column({ nullable: false, name: 'memberId' })
  @RelationId((posts: Posts) => posts.member)
  memberId: number;
}
