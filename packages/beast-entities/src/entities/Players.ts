// Libraries
import {
  Entity,
  Index,
  OneToOne,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
import { Users } from '.'

@Index('players_pk', ['id'], { unique: true })
@Entity('players', { schema: 'public' })
export class Players extends BaseEntity {
  @OneToOne(() => Users, user => user.player)
  user: Users;
}
