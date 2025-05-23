import { GraphQLList, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { MemberType, MemberTypeId } from './types/member-types.js';
import { ResolverContext } from './types/context.js';
import { ProfileType } from './types/profile-types.js';
import { UUIDType } from "./types/uuid.js";

export const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_parent: unknown, _args: unknown, context: ResolverContext) => {
        return await context.prisma.memberType.findMany();
      }
    },
    memberTypeId: {
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
    profileId: {
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
  }
});
