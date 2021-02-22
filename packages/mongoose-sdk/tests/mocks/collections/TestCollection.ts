// Libraries
import { Schema } from 'mongoose';

// Dependencies
import { MongooseDBCollection } from '../../../src';

interface TestCollection {
  email: string
  fullName: string
  reference: string
}

const testCollectionSchema = new Schema<TestCollection>({
  email:  {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/i, 'Invalid email pattern'],
    minlength: 1,
  },
  fullName: {
    type: String,
    required: true,
    minlength: 1,
  },
  reference: {
    type: String,
    required: true,
    minlength: 1,
  },
});

export const testCollection = new MongooseDBCollection<TestCollection>({
  name: 'TestCollection',
  schema: testCollectionSchema,
  collectionName: 'test_collection',
});
