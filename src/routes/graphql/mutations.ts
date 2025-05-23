import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { ProfileType, CreateProfileInputType, Profile, UpdateProfile, UpdateProfileInputType } from "./types/profile-types.js";
import { ResolverContext } from "./types/context.js";
import { UUIDType } from "./types/uuid.js";

export const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createProfile: {
      type: ProfileType,
      args: {
        data: { type: new GraphQLNonNull(CreateProfileInputType) }
      },
      resolve: async (_parent: unknown, _args: { data: Profile }, context: ResolverContext) => {
        return await context.prisma.profile.create({
          data: _args.data,
        })
      }
    },
    updateProfile: {
      type: ProfileType,
      args: {
        data: { type: new GraphQLNonNull(UpdateProfileInputType) },
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { data: UpdateProfile, id: string }, context: ResolverContext) => {
        return await context.prisma.profile.update({
          where: { id: _args.id },
          data: _args.data,
        })
      }
    },
    deleteProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        return await context.prisma.profile.delete({
          where: { id: _args.id }
        })
      }
    },
  }
})
