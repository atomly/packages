// Dependencies
import { MongooseDBSchema } from '../../src';

interface TestCollection {
  id: string;
}

const testSchema = new MongooseDBSchema<TestCollection>({
  id:  {
    type: String,
    required: true,
    unique: true,
  },
});

const fooSchema = testSchema.extend({
  foo: {
    type: String,
    required: true,
    unique: true,
  },
});

describe('MongooseDBSchema instantiated correctly', () => {
  it('correctly instantiates the testSchema', () => {
    expect(testSchema).toBeInstanceOf(MongooseDBSchema);
  });
});

describe('MongooseDBSchema extend API works correctly', () => {
  test('correctly instantiates the fooSchema', () => {
    expect(fooSchema).toBeInstanceOf(MongooseDBSchema);
  });

  test('fooSchema obj property is extended from testSchema obj property', () => {
    expect(JSON.stringify(fooSchema.obj)).toBe(JSON.stringify({
      id:  {
        type: String,
        required: true,
        unique: true,
      },
      foo: {
        type: String,
        required: true,
        unique: true,
      },
    }));
  });

  test('testSchema obj property is left intact', () => {
    console.log('testSchema.obj: ', testSchema.obj);
    expect(JSON.stringify(testSchema.obj)).toBe(JSON.stringify({
      id:  {
        type: String,
        required: true,
        unique: true,
      },
    }));
  });
});
