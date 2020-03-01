import gql from 'graphql-tag';

export default gql`
type Query {
  test: String!
  ping: String!
}
`;
