// Libraries
import {
  Entity,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity';

@Entity('members', { schema: 'public' })
export class Members extends BaseEntity {}
