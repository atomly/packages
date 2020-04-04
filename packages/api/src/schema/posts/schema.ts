import gql from 'graphql-tag';

export default gql`
type Post {
  id: ID!
  memberId: ID!
  header: String
  body: String
}

type Query {
  posts: [Post]
  post(id: ID!): Post
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
