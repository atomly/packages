import gql from 'graphql-tag';

export default gql`
input FindUserPostsInput {
  limit: Int!
  offset: Int!
}

type User {
  id: ID!
  email: ID!
  # Custom Resolvers:
  posts(input: FindUserPostsInput): [Post]
}

type Query {
  users: [User]
  user(id: ID!): User
  me: User
}

input NewUserInput {
  email: String!
  password: String!
}

input AuthenticateInput {
  email: String!
  password: String!
}

type Mutation {
  newUser(input: NewUserInput!): User
  authenticate(input: AuthenticateInput!): User
  logout: Boolean!
}
`;
