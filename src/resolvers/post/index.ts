// Libraries
import { validate } from 'class-validator';

// Types
import { Beast } from '@typings/graphql';

// Entity
import { Post } from '@entity/Post';

// Utils
import { resolverFactory } from '@utils/index';
import { parseValidationErrors } from '@root/utils';

//
// QUERIES
//

const post: Beast.TQueryPost = async function user(_, { id }, context) {
  const post = await context.prisma.posts.findOne({ where: { id: +id } });
  return post;  
}

const posts: Beast.TQueryPosts = async function users(_, __, context) {
  const posts = await context.prisma.posts.findMany();
  return posts;
}

//
// MUTATIONS
//

const newPost: Beast.TMutationNewPost = async function newUser(
  _,
  args,
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
    return post;
  }
}
export default resolverFactory(
  {
    post,
    posts,
  },
  {
    newPost,
  },
);
