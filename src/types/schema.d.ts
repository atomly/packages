// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation | ISubscription;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
hello: string;
users: Array<IUser | null> | null;
user: IUser | null;
}

interface IHelloOnQueryArguments {
name: string;
}

interface IUserOnQueryArguments {
id: string;
}

interface IUser {
__typename: "User";
id: string;
email: string;
password: string;
}

interface IMutation {
__typename: "Mutation";
newUser: IUser | null;
}

interface INewUserOnMutationArguments {
email: string;
password: string;
}

interface ISubscription {
__typename: "Subscription";
hello: string;
}

interface IHelloOnSubscriptionArguments {
name: string;
}
}

// tslint:enable
