import { GraphQLList, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { MemberType, MemberTypeId } from './types/member-types.js';
import { ResolverContext } from './types/context.js';
import { ProfileType } from './types/profile-types.js';
import { UUIDType } from "./types/uuid.js";
import { PostType } from './types/post-types.js';
import { UserType } from './types/user-types.js';

export const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_parent: unknown, _args: unknown, context: ResolverContext) => {
        return await context.prisma.memberType.findMany();
      }
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeId }
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        return await context.prisma.memberType.findUnique({
          where: {
            id: _args.id,
          }
        });
      }
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_parent: unknown, _args: unknown, context: ResolverContext) => {
        return await context.prisma.profile.findMany();
      }
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        return await context.prisma.profile.findUnique({
          where: {
            id: _args.id,
          }
        });
      }
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_parent: unknown, _args: unknown, context: ResolverContext) => {
        return await context.prisma.post.findMany();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        return await context.prisma.post.findUnique({
          where: {
            id: _args.id,
          }
        });
      }
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: (async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        const users = await context.prisma.user.findMany();

        return users;
      })
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        return await context.prisma.user.findUnique({
          where: {
            id: _args.id,
          }
        });
      }
    },
  }
});
