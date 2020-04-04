// Libraries
import { Posts } from '@beast/beast-entities';

// Types
import { IThrowError } from '@root/utils/throwError/errors';
import { IPostResolverMap } from './types';

// Utils
import { validateNewEntity } from '@root/utils';

// TODO: Generate new pubsub trigger identifiers based on request session.
const PUBSUB_NEW_POST = 'PUBSUB_NEW_POST';

const resolver: IPostResolverMap = {
  Query: {
    async post(_, { id }, { database }): Promise<Posts | undefined> {
      const post = await database.connection
        .getRepository(Posts)
        .findOne({ where: { id: +id } });
      return post;  
    },
    async posts(_, __, { database }): Promise<Posts[]> {
      const posts = await database.connection
        .getRepository(Posts)
        .find();
      return posts;
    },
  },
  Mutation: {
    async newPost(
      _,
      { input },
      { pubsub, database, loaders },
    ): Promise<Posts | IThrowError> {
      const post = database.connection.getRepository(Posts).create({
        header: input.header,
        body: input.body,
        memberId: +input.memberId,
      });
      await validateNewEntity(post);
      await post.save();
      pubsub.publish(
        // Socket channel.
        PUBSUB_NEW_POST,
        // { [key]: [payload] } - `key` MUST match the name of the subscription resolver.
        { newPostSubscription: post },
      );
      // Clearing the batch cache of the user.
      loaders.Posts.manyLoaderByMemberIds.clear(input.memberId);
      return post;
    },
  },
  Subscription: {
    newPostSubscription: {
      subscribe(
        _,
        __,
        { pubsub },
      ): AsyncIterator<Posts> {
        return pubsub.asyncIterator<Posts>(PUBSUB_NEW_POST);
      },
    },
  },
};

export default resolver;
