// Dependencies
const mergeGraphqlSchemas = require('merge-graphql-schemas');
const fileLoader = mergeGraphqlSchemas.fileLoader;
const mergeTypes = mergeGraphqlSchemas.mergeTypes;
const { writeFileSync } = require('fs');

// Type definitions array
const typesArray = fileLoader(`${__dirname}/**/*.graphql`);

// Generate schema file
writeFileSync(`${__dirname}/schema.graphql`, mergeTypes(typesArray, { all: true }));
