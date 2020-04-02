// Libraries
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { writeFileSync } from 'fs';

const typesArray = fileLoader(`${__dirname}/**/*.*`);

if (process.env.NODE_ENV === 'development') {
  writeFileSync(`${__dirname}/schema.graphql`, '', { flag : 'w' }); // Deletes first.
  writeFileSync(`${__dirname}/schema.graphql`, typesArray, { flag : 'w' });
}

export const typeDefs: string = mergeTypes(typesArray, { all: true });
