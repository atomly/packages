// Libraries
import Maybe from 'graphql/tsutils/Maybe'

declare namespace TSJest {
  interface IGqlCallOptions {
    source: string;
    variableValues?: Maybe<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }>;
  }
}
