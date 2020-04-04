import gql from 'graphql-tag';

export default gql`
type Post {
  id: ID!
  memberId: ID!
  header: String
  body: String
}

input FindPostInput {
  id: ID!
}

type Query {
  posts: [Post]
  post(input: FindPostInput!): Post
}

input NewPostInput {
  memberId: ID!
  header: String!
  body: String!
}

type Mutation {
  newPost(input: NewPostInput!): Post
}

type Subscription {
  newPostSubscription: Post!
}
`;
