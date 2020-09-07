// Libraries
import {
  Entity,
  OneToMany,
  JoinColumn,
  RelationId,
} from 'typeorm';

// Dependencies
import { BaseEntity } from '../../src';
import { TestEntity4 } from './TestEntity4';

@Entity('test_entity_3')
export class TestEntity3 extends BaseEntity {
  //
  // ONE TO MANY RELATIONS
  //

  @OneToMany(() => TestEntity4, testEntities4s => testEntities4s.testEntity3)
  @JoinColumn()
  testEntities4s: TestEntity4[];

  @RelationId((testEntity3s: TestEntity3) => testEntity3s.testEntities4s)
  testEntities4sIds: string[];
}
