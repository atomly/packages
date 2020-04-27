import gql from 'graphql-tag';

export default gql`
type Subscription {
  hello(name: String!): String!
}
`;
