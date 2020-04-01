// Libraries
import { Beast } from '@root/types/index';
import { IThrowError } from '@utils/throwError/errors'

// Query resolvers
type TQueryTest = Beast.Resolver<null, null, string | IThrowError>
type TQueryPing = Beast.Resolver<null, null, string>

export interface IQueryResolverMap extends Beast.Implements<Beast.IResolver, IQueryResolverMap> {
  Query: {
    test: TQueryTest
    ping: TQueryPing
  }
}
