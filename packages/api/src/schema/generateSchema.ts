
// Libraries
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { writeFileSync } from 'fs';

const typesArray = fileLoader(`${__dirname}/**/*.ts`);
const schema: string = mergeTypes(typesArray, { all: true });

writeFileSync(`${__dirname}/schema.graphql`, '', { flag : 'w' }); // Deletes first.
writeFileSync(`${__dirname}/schema.graphql`, schema, { flag : 'w' });

// Schema string
export default schema;
