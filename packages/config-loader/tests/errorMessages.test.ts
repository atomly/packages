// Libraries
import 'reflect-metadata';

// Dependencies
import { ErrorMessagesLoader } from './fixtures/errorMessages';

describe('config using .env.test works correctly', () => {
  test('errorMessagesLoader should throw errors due to invalid bar & baz properties', async () => {
    const errorMessagesLoader = new ErrorMessagesLoader({ fileLocationUri: '' });

    const invalidData = {
      __name: 'errorMessages',
      __fileLocationUri: 'errorMessages',
      messages: [
        {
          bar: null,
          baz: null,
        },
      ],
    };

    let error;

    try {
      await errorMessagesLoader.__validate(invalidData);
    } catch (err) {
      console.debug('ERROR: ', err);

      error = err;
    }

    expect(error).toBeTruthy();

    expect(error.message).toContain('- property messages[0].bar has failed the following constraints: isDefined, isObject, isNotEmptyObject');

    expect(error.message).toContain('- property messages[0].baz has failed the following constraints: isString');
  });

  test('errorMessagesLoader should throw errors due to invalid foobar property', async () => {
    const errorMessagesLoader = new ErrorMessagesLoader({ fileLocationUri: '' });

    const invalidData = {
      __name: 'errorMessages',
      __fileLocationUri: 'errorMessages',
      messages: [
        {
          bar: {
            foobar: null,
          },
          baz: 'baz',
        },
      ],
    };

    let error;

    try {
      await errorMessagesLoader.__validate(invalidData);
    } catch (err) {
      console.debug('ERROR: ', err);

      error = err;
    }

    expect(error).toBeTruthy();

    expect(error.message).toContain('- property messages[0].bar.foobar has failed the following constraints: isString');
  });
});
