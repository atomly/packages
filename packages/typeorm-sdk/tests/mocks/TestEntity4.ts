// Libraries
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

// Dependencies
import { BaseEntity } from '../../src';
import { TestEntity3 } from './TestEntity3';

@Entity('test_entity_4')
export class TestEntity4 extends BaseEntity {
  //
  // TestEntity3 FK
  //

  @ManyToOne(() => TestEntity3, undefined, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ referencedColumnName: 'id' })
  testEntity3: TestEntity3;

  @Column({ nullable: false, name: 'testEntity3Id' })
  @RelationId((testEntities4s: TestEntity4) => testEntities4s.testEntity3)
  testEntity3Id: string;
}
