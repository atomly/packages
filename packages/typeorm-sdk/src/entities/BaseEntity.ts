// Libraries
import {
  BaseEntity as Base,
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsOptional,
  IsDate,
} from 'class-validator';

export abstract class BaseEntity extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @IsDate()
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @IsOptional()
  @IsDate()
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  //
  // Before Insert & Update "Hooks"
  //

  @BeforeInsert()
  beforeInsert(): void {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  beforeUpdate(): void {
    const now = new Date();
    this.updatedAt = now;
  }
}
