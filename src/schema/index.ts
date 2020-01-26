// Dependencies
const mergeGraphqlSchemas = require('merge-graphql-schemas');
const fileLoader = mergeGraphqlSchemas.fileLoader;
const mergeTypes = mergeGraphqlSchemas.mergeTypes;

// Type definitions array
const typesArray = fileLoader(`${__dirname}/**/*.graphql`);

// Schema string
export default mergeTypes(typesArray, { all: true });
