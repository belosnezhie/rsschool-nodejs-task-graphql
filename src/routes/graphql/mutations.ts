import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { ProfileType, CreateProfileInputType, Profile } from "./types/profile-types.js";
import { ResolverContext } from "./types/context.js";

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
  }
})
