import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { PostType } from "./post-types.js";
import { ResolverContext } from "./context.js";
import { ProfileType } from "./profile-types.js";

export interface User {
  name: string;
  balance: number;
}

export interface Subscribe {
  subscriberId: string;
  authorId: string;
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: async (_parent: { id: string }, _args: unknown, context: ResolverContext) => {
        return await context.loaders.profileLoader.load(_parent.id);
      }
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_parent: { id: string }, _args: unknown, context: ResolverContext) => {
        return await context.loaders.postLoader.load(_parent.id);
      }
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (_parent: { id: string }, _args: unknown, context: ResolverContext) => {
        return await context.loaders.userSubscribedToLoader.load(_parent.id);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (_parent: { id: string }, _args: unknown, context: ResolverContext) => {
        return await context.loaders.subscribedToUserLoader.load(_parent.id);
      },
    }

  })
})

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }
})

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }
})
