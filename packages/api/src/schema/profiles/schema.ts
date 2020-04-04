import gql from 'graphql-tag';

export default gql`
type Profile {
  id: ID!
  # Custom Resolvers:
  member: Member!
}

input FindProfileInput {
  id: ID!
}

type Query {
  profile(input: FindProfileInput!): Profile
}
`;
