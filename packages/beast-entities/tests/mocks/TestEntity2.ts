// Libraries
import {
  Entity,
  Column,
} from 'typeorm';

// Dependencies
import { BaseEntity } from '../../src';
import { TestEntity1 } from './TestEntity1';

@Entity('test_entity_2')
export class TestEntity2 extends BaseEntity {
  //
  // ONE TO ONE RELATIONS
  //

  @Column({ type: 'uuid', nullable: false })
  testEntity1Id: TestEntity1['id'];
}
