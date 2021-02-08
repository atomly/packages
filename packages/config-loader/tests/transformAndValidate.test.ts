/**
 * Forked from [class-transformer-validator](https://github.com/MichalLytek/class-transformer-validator).
 * By [Michał Lytek](https://github.com/MichalLytek).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jest/no-try-expect */
import { ValidationError, IsEmail } from 'class-validator';
import { transformAndValidate, transformAndValidateSync } from '../src';

class User {
  @IsEmail()
  public email!: string;

  public greet(): string {
    return 'Greeting';
  }
}

describe('transformAndValidate()', () => {
  let user: User;
  const rejectMessage = 'Incorrect object param type! Only string, plain object and array of plain objects are valid.';

  beforeEach(() => {
    user = {
      email: 'test@test.com',
    } as User;
  });

  it('should successfully transform and validate User plain object', async () => {
    const transformedUser = await transformAndValidate(User, user) as User;

    expect(transformedUser).toBeTruthy();
    expect(transformedUser.email).toBe('test@test.com');
    expect(transformedUser.greet()).toBe('Greeting');
  });

  it('should successfully transform and validate JSON with User object', async () => {
    const userJson: string = JSON.stringify(user);

    const transformedUser = (await transformAndValidate(
      User,
      userJson,
    )) as User;

    expect(transformedUser).toBeTruthy();
    expect(transformedUser.email).toBe('test@test.com');
    expect(transformedUser.greet()).toBe('Greeting');
  });

  it('should successfully transform and validate JSON with array of Users', async () => {
    const userJson: string = JSON.stringify([user]);

    const transformedUsers = (await transformAndValidate(
      User,
      userJson,
    )) as User[];

    expect(transformedUsers).toBeTruthy();
    expect(transformedUsers).toBeInstanceOf(Array);
    expect(transformedUsers).toHaveLength(1);
    expect(transformedUsers[0].email).toBe('test@test.com');
    expect(transformedUsers[0].greet()).toBe('Greeting');
  });

  it('should successfully transform and validate array of User objects', async () => {
    const users = [user, user, user];

    const transformedUsers = await transformAndValidate(User, users) as User[];

    expect(transformedUsers).toBeTruthy();
    expect(transformedUsers).toHaveLength(3);
    expect(transformedUsers[0].email).toBe('test@test.com');
    expect(transformedUsers[1].greet()).toBe('Greeting');
  });

  it('should throw ValidationError array when object property is not passing validation', async () => {
    const sampleUser = {
      email: 'test@test',
    } as User;

    await transformAndValidate(User, sampleUser)
      .catch((error: ValidationError[]) => {
        expect(error).toHaveLength(1);
        expect(error[0]).toBeInstanceOf(ValidationError);
      });
  });

  it('should throw ValidationError array when json\'s property is not passing validation', async () => {
    const sampleUser = {
      email: 'test@test',
    } as User;
    const userJson: string = JSON.stringify(sampleUser);

    await transformAndValidate(User, userJson)
      .catch((error: ValidationError[]) => {
        expect(error).toHaveLength(1);
        expect(error[0]).toBeInstanceOf(ValidationError);
      });
  });

  it('should throw array of ValidationError arrays when properties of objects from array are not passing validation', async () => {
    const sampleUser = {
      email: 'test@test',
    } as User;
    const users = [sampleUser, sampleUser, sampleUser];

    await transformAndValidate(User, users)
      .catch((error: ValidationError[][]) => {
        expect(error).toHaveLength(users.length);
        expect(error[0]).toHaveLength(1);
        expect(error[0][0]).toBeInstanceOf(ValidationError);
      });
  });

  it('should throw SyntaxError while parsing invalid JSON string', async () => {
    const userJson = JSON.stringify(user) + 'error';

    await transformAndValidate(User, userJson)
      .catch((error: SyntaxError) => {
        expect(error).toBeInstanceOf(SyntaxError);
      });
  });

  it('should throw Error when object parameter is a number', async () => {
    await transformAndValidate(User, 2 as any)
      .catch((error: Error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(rejectMessage);
      });
  });

  it('should throw Error when object parameter is a function', async () => {
    const func = (): unknown => ({ email: 'test@test.com' });

    await transformAndValidate(User, func)
      .catch((error: Error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(rejectMessage);
      });
  });

  it('should throw Error when object parameter is a boolean value', async () => {
    await transformAndValidate(User, true as any)
      .catch((error: Error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(rejectMessage);
      });
  });

  it('should throw Error when object parameter is a null', async () => {
    await transformAndValidate(User, null as any)
      .catch((error: Error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(rejectMessage);
      });
  });

  it('should throw Error when object parameter is an undefined', async () => {
    await transformAndValidate(User, null as any)
      .catch((error: Error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(rejectMessage);
      });
  });
});

describe('transformAndValidateSync()', () => {
  let user: User;
  const rejectMessage =
    'Incorrect object param type! Only string, plain object and array of plain objects are valid.';

  beforeEach(() => {
    user = {
      email: 'test@test.com',
    } as User;
  });

  it('should successfully transform and validate User plain object', async () => {
    const transformedUser = transformAndValidateSync(User, user) as User;

    expect(transformedUser).toBeTruthy();
    expect(transformedUser.email).toBe('test@test.com');
    expect(transformedUser.greet()).toBe('Greeting');
  });

  it('should successfully transform and validate JSON with User object', async () => {
    const userJson: string = JSON.stringify(user);

    const transformedUser = transformAndValidateSync(User, userJson) as User;

    expect(transformedUser).toBeTruthy();
    expect(transformedUser.email).toBe('test@test.com');
    expect(transformedUser.greet()).toBe('Greeting');
  });

  it('should successfully transform and validate JSON with array of Users', async () => {
    const userJson: string = JSON.stringify([user]);

    const transformedUsers = transformAndValidateSync(User, userJson) as User[];

    expect(transformedUsers).toBeTruthy();
    expect(transformedUsers).toBeInstanceOf(Array);
    expect(transformedUsers).toHaveLength(1);
    expect(transformedUsers[0].email).toBe('test@test.com');
    expect(transformedUsers[0].greet()).toBe('Greeting');
  });

  it('should successfully transform and validate array of User objects', async () => {
    const users = [user, user, user];

    const transformedUsers = transformAndValidateSync(User, users) as User[];

    expect(transformedUsers).toBeTruthy();
    expect(transformedUsers).toHaveLength(3);
    expect(transformedUsers[0].email).toBe('test@test.com');
    expect(transformedUsers[1].greet()).toBe('Greeting');
  });

  it('should throw ValidationError array when object property is not passing validation', async () => {
    const sampleUser = {
      email: 'test@test',
    } as User;

    try {
      transformAndValidateSync(User, sampleUser);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toHaveLength(1);
      expect(error[0]).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw ValidationError array when json\'s property is not passing validation', async () => {
    const sampleUser = {
      email: 'test@test',
    } as User;
    const userJson: string = JSON.stringify(sampleUser);

    try {
      transformAndValidateSync(User, userJson);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toHaveLength(1);
      expect(error[0]).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw array of ValidationError arrays when properties of objects from array are not passing validation', async () => {
    const sampleUser = {
      email: 'test@test',
    } as User;
    const users = [sampleUser, sampleUser, sampleUser];

    try {
      transformAndValidateSync(User, users);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toHaveLength(users.length);
      expect(error[0]).toHaveLength(1);
      expect(error[0][0]).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw SyntaxError while parsing invalid JSON string', async () => {
    const userJson = JSON.stringify(user) + 'error';

    try {
      transformAndValidateSync(User, userJson);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it('should throw Error when object parameter is a number', async () => {
    try {
      transformAndValidateSync(User, 2 as any);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.message).toBe(rejectMessage);
    }
  });

  it('should throw Error when object parameter is a function', async () => {
    const func = (): unknown => ({ email: 'test@test.com' });

    try {
      transformAndValidateSync(User, func);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.message).toBe(rejectMessage);
    }
  });

  it('should throw Error when object parameter is a boolean value', async () => {
    try {
      transformAndValidateSync(User, true as any);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.message).toBe(rejectMessage);
    }
  });

  it('should throw Error when object parameter is a null', async () => {
    try {
      transformAndValidateSync(User, null as any);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.message).toBe(rejectMessage);
    }
  });

  it('should throw Error when object parameter is an undefined', async () => {
    try {
      transformAndValidateSync(User, void 0 as any);
      throw new Error('error should be thrown');
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.message).toBe(rejectMessage);
    }
  });
});
