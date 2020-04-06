// Libraries
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const typesArray = fileLoader(`${__dirname}/**/*`).filter(file => {
  return file.kind !== 'Document' && Object.keys(file).length !== 0;
});

if (process.env.NODE_ENV !== 'production') {
  writeFileSync(resolve(__dirname, '.', 'schema.graphql'), '', { flag : 'w' }); // Deletes first.
  writeFileSync(resolve(__dirname, '.', 'schema.graphql'), typesArray, { flag : 'w' });
}

export const typeDefs: string = mergeTypes(typesArray, { all: true });
