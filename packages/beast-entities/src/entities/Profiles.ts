// Libraries
import {
  Entity,
  Index,
  // OneToOne,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'
// import { Users } from '.'

@Index('profiles_pk', ['id'], { unique: true })
@Entity('profiles', { schema: 'public' })
export class Profiles extends BaseEntity {}
