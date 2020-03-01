import DataLoader from 'dataloader';
import { User } from '@root/entity/User';

type TBatchUsers = (ids: readonly string[]) => Promise<User[]>;

const batchUsers: TBatchUsers = async function batchUsers(ids) {
  const channels = await User.findByIds(ids as string[]);
  const channelsMap: { [key: string]: User } = {};
  channels.forEach(channel => {
    channelsMap[channel.id] = channel;
  });
  return ids.map(id => channelsMap[id]);
}

export function UserLoader(): DataLoader<string, User, unknown> {
  return new DataLoader<string, User>(batchUsers);
}
