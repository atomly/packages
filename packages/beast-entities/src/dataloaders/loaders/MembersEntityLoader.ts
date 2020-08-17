// Dependencies
import { Members } from '../../entities';
import { DefaultEntityLoadersFactory } from '../factory/DefaultEntityLoadersFactory';

enum EMembersEntityReferenceKeys {
  ID = 'id',
  PROFILE_ID = 'profileId',
}

export const membersEntityLoaders = new DefaultEntityLoadersFactory<typeof Members, EMembersEntityReferenceKeys>({
  entity: Members,
  entityReferenceIdKeysEnum: EMembersEntityReferenceKeys,
  entityReferenceIdKeysParams: {
    id: {
      entityIdKey: EMembersEntityReferenceKeys.ID,
    },
    profileId: {
      entityIdKey: EMembersEntityReferenceKeys.PROFILE_ID,
    },
  },
});
