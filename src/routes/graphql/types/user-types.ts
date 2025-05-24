import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { PostType } from "./post-types.js";
import { ResolverContext } from "./context.js";
import { ProfileType } from "./profile-types.js";

export interface User {
  name: string;
  balance: number;
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
        return await context.prisma.profile.findUnique({
          where: {
            userId: _parent.id,
          },
        });
      }
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_parent: { id: string }, _args: unknown, context: ResolverContext) => {
        return await context.prisma.post.findMany({
          where: {
            authorId: _parent.id,
          },
        });
      }
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (_parent: { id: string }, _args: unknown, context: ResolverContext) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
          where: {
            subscriberId: _parent.id,
          },
          include: {
            author: true,
          },
        });

        return subscriptions.map((sub) => sub.author);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (_parent: { id: string }, _args: unknown, context: ResolverContext) => {
        return await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: _parent.id,
              },
            },
          },
        });
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
