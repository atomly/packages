// Libraries
import {
  Entity,
  Index,
  OneToOne,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Users } from '.'

@Index('recruiters_pk', ['id'], { unique: true })
@Entity('recruiters', { schema: 'public' })
export class Recruiters extends BaseEntity {
  @OneToOne(() => Users, user => user.player)
  user: Users;
}
