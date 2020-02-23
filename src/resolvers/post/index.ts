// Libraries
import { validate } from 'class-validator';

// Types
import { Beast } from '@typings/graphql';
import { posts } from '@prisma/client';

// Entity
import { Post } from '@entity/Post';

// Utils
import { resolverFactory } from '@utils/index';
import { parseValidationErrors } from '@root/utils';

const PUBSUB_NEW_POST = 'PUBSUB_NEW_POST';

//
// QUERIES
//

const post: Beast.TQueryPost = async function user(_, { id }, { prisma }) {
  const post = await prisma.posts.findOne({ where: { id: +id } });
  return post;  
}

const posts: Beast.TQueryPosts = async function users(_, __, { prisma }) {
  const posts = await prisma.posts.findMany();
  return posts;
}

//
// MUTATIONS
//

const newPost: Beast.TMutationNewPost = async function newUser(
  _,
  args,
  { pubsub },
) {
  const post = Post.create({
    header: args.input.header,
    body: args.input.body,
  });
  const errors = await validate(post);
  if (errors.length > 0) {
    throw new Error(parseValidationErrors(errors, 'post')); 
  } else {
    await post.save();
    pubsub.publish(
      PUBSUB_NEW_POST, // Socket channel.
      {
        newPostSubscription: post, // [key] MUST match the name of the subscription resolver.
      }, // Payload.
    );
    return post;
  }
}

//
// SUBSCRIPTIONS
//

const newPostSubscription: Beast.TSubscriptionNewPost = function newUser(
  _,
  __,
  { pubsub },
) {
  return pubsub.asyncIterator<posts>(PUBSUB_NEW_POST);
}

export default resolverFactory(
  {
    post,
    posts,
  },
  {
    newPost,
  },
  {
    newPostSubscription: {
      subscribe: newPostSubscription,
    },
  },
);
