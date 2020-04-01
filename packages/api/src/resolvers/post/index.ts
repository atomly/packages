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
      args,
      { pubsub, database },
    ): Promise<Posts | IThrowError> {
      const post = database.connection.getRepository(Posts).create({
        header: args.input.header,
        body: args.input.body,
      });
      const result = await validateNewEntity(post, async () => {
        await post.save();
        pubsub.publish(
          PUBSUB_NEW_POST, // Socket channel.
          {
            newPostSubscription: post, // [key] MUST match the name of the subscription resolver.
          }, // Payload.
        );
        return post;
      });
      return result;
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
