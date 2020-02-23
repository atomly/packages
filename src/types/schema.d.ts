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
ping: string;
users: Array<IUser | null> | null;
user: IUser | null;
me: IUser | null;
posts: Array<IPost | null> | null;
post: IPost | null;
}

interface IUserOnQueryArguments {
id: string;
}

interface IPostOnQueryArguments {
id: string;
}

interface IUser {
__typename: "User";
id: string;
email: string;
}

interface IPost {
__typename: "Post";
id: string;
header: string | null;
body: string | null;
}

interface IMutation {
__typename: "Mutation";
newUser: IUser | null;
authenticate: IUser | null;
logout: boolean;
newPost: IPost | null;
}

interface INewUserOnMutationArguments {
input: INewUserInput;
}

interface IAuthenticateOnMutationArguments {
input: IAuthenticateInput;
}

interface INewPostOnMutationArguments {
input: INewPostInput;
}

interface INewUserInput {
email: string;
password: string;
}

interface IAuthenticateInput {
email: string;
password: string;
}

interface INewPostInput {
header: string;
body: string;
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
