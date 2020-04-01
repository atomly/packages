// Libraries
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader(`${__dirname}/**/*.*`);
export const typeDefs: string = mergeTypes(typesArray, { all: true });
