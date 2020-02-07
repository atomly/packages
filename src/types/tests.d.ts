// Libraries
import { ChildProcess } from 'child_process';
import { PrismaClient } from '@prisma/client';
import Maybe from 'graphql/tsutils/Maybe'

declare namespace TSJest {
  interface Global {
    document: Document;
    window: Window;
    prisma: PrismaClient<{}, never>;
    server: ChildProcess;
    onStart() : void;
  }
  interface IGqlCallOptions {
    source: string;
    variableValues?: Maybe<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }>;
  }
}
