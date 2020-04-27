import gql from 'graphql-tag';

export default gql`
type Team {
  id: ID!
  # Custom Resolvers:
  members: [Member]
}

input FindTeamInput {
  id: ID!
}

type Query {
  teams: [Team]
  team(input: FindTeamInput!): Team
}

input NewTeamInput {
  createdBy: ID!
}

input UpdateTeamInput {
  id: ID!
  newMember: ID!
}

type Mutation {
  newTeam(input: NewTeamInput!): Team
  updateTeam(input: UpdateTeamInput!): Team
}
`;
