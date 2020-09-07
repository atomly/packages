// Libraries
import {
  Entity,
  Column,
} from 'typeorm';

// Dependencies
import { BaseEntity } from './BaseEntity';
import { TestEntity2 } from './TestEntity2';

@Entity('test_entity_1')
export class TestEntity1 extends BaseEntity {
  //
  // ONE TO ONE RELATIONS
  //

  @Column({ type: 'uuid', nullable: false, unique: true })
  testEntity2Id: TestEntity2['id'];
}
