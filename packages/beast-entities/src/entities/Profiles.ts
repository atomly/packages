// Libraries
import {
  Entity,
  Index,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity'

@Index('profiles_pk', ['id'], { unique: true })
@Entity('profiles', { schema: 'public' })
export class Profiles extends BaseEntity {}
