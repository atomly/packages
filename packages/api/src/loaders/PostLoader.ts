import DataLoader from 'dataloader';
import { Post } from '@root/entity/Post';

type TBatchPosts = (ids: readonly string[]) => Promise<Post[]>;

const batchPosts: TBatchPosts = async function batchPosts(ids) {
  const channels = await Post.findByIds(ids as string[]);
  const channelsMap: { [key: string]: Post } = {};
  channels.forEach(channel => {
    channelsMap[channel.id] = channel;
  });
  return ids.map(id => channelsMap[id]);
}

export function PostLoader(): DataLoader<string, Post, unknown> {
  return new DataLoader<string, Post>(batchPosts);
}
