// Libraries
import {
  BaseEntity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

export abstract class MongoBaseEntity extends BaseEntity {
  @ObjectIdColumn()
  public _id: ObjectID;
}
