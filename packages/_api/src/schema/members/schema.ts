import gql from 'graphql-tag';

export default gql`
type Member {
  id: ID!
  # Custom Resolvers:
  posts: [Post]
  profile: Profile!
  teams: [Team]
}

input FindMemberInput {
  id: ID!
}

type Query {
  members: [Member]
  member(input: FindMemberInput!): Member
}
`;
