// Types
import { FieldNode, GraphQLResolveInfo } from 'graphql';

export function isQueryingResolver(info: GraphQLResolveInfo, resolverName: string): boolean {
  return Boolean(
    info.fieldNodes[0].selectionSet?.selections
      .find(selection => (selection as FieldNode).name.value === resolverName
    ),
  );
}
