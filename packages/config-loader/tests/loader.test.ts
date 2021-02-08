// Libraries
import 'reflect-metadata';

// Dependencies
import { NestedArrayLoader } from './fixtures/nestedArray';

describe('loaders API', () => {
  describe('loader validates data correctly', () => {
    const validData = {
      __name: 'nestedArray',
      __fileLocationUri: 'nestedArray',
      foo: [
        {
          bar: {
            foobar: 'ipsum',
          },
          baz: 'lorem',
        },
      ],
    };
  
    test('nestedArray should throw errors due to minimum amount of 1 element', async () => {
      const nestedArrayLoader = new NestedArrayLoader({ fileLocationUri: '' });
  
      const invalidData = {
        __name: 'nestedArray',
        __fileLocationUri: 'nestedArray',
        foo: [],
      };
  
      await expect(
        async () => {
          try {
            await nestedArrayLoader.__validate(invalidData);
          } catch (err) {
            console.error('ERROR: ', err);
            console.error('ERROR err.children: ', err.children);
            throw err;
          }
        },
      ).rejects.toBeTruthy();
    });
  
    test('nestedArray should throw errors due to invalid baz property', async () => {
      const nestedArrayLoader = new NestedArrayLoader({ fileLocationUri: '' });
  
      const invalidData = {
        __name: 'nestedArray',
        __fileLocationUri: 'nestedArray',
        foo: [
          {
            bar: {
              foobar: 'ipsum',
            },
            baz: null,
          },
        ],
      };
  
      await expect(
        async () => {
          try {
            await nestedArrayLoader.__validate(invalidData);
          } catch (err) {
            console.error('ERROR: ', err);
            throw err;
          }
        },
      ).rejects.toBeTruthy();
    });
  
    test('nestedArray should throw errors due to invalid bar property', async () => {
      const nestedArrayLoader = new NestedArrayLoader({ fileLocationUri: '' });
  
      const invalidData = {
        __name: 'nestedArray',
        __fileLocationUri: 'nestedArray',
        foo: [
          {
            bar: {},
            baz: "lorem",
          },
        ],
      };
  
      await expect(
        async () => {
          try {
            await nestedArrayLoader.__validate(invalidData);
          } catch (err) {
            console.error('ERROR: ', err);
            throw err;
          }
        },
      ).rejects.toBeTruthy();
    });
  
    test('nestedArray should throw errors due to invalid foobar property', async () => {
      const nestedArrayLoader = new NestedArrayLoader({ fileLocationUri: '' });
  
      const invalidData = {
        __name: 'nestedArray',
        __fileLocationUri: 'nestedArray',
        foo: [
          {
            bar: {
              foobar: null,
            },
            baz: "lorem",
          },
        ],
      };
  
      await expect(
        async () => {
          try {
            await nestedArrayLoader.__validate(invalidData);
          } catch (err) {
            console.error('ERROR: ', err);
            throw err;
          }
        },
      ).rejects.toBeTruthy();
    });
  
    test('nestedArray should throw all of the previous `foo` errors', async () => {
      const nestedArrayLoader = new NestedArrayLoader({ fileLocationUri: '' });
  
      const invalidData = {
        __name: 'nestedArray',
        __fileLocationUri: 'nestedArray',
        foo: [
          {
            bar: {
              foobar: 'ipsum',
            },
            baz: null,
          },
          {
            bar: {},
            baz: "lorem",
          },
          {
            bar: {
              foobar: null,
            },
            baz: "lorem",
          },
        ],
      };

      await expect(
        async () => {
          try {
            await nestedArrayLoader.__validate(invalidData);
          } catch (err) {
            console.error('ERROR: ', err);
            // eslint-disable-next-line jest/no-try-expect
            expect(err[0].children.length).toHaveLength(invalidData.foo.length);
            throw err;
          }
        },
      ).rejects.toBeTruthy();
    });
  
    test('nestedArray should throw no errors with valid data', async () => {
      const nestedArrayLoader = new NestedArrayLoader({ fileLocationUri: '' });

      await expect(nestedArrayLoader.__validate(validData)).resolves.toMatchObject(validData);
    });
  })
});
