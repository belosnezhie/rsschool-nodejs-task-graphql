import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberType, MemberTypeId, MemberTypeIdEnum } from "./member-types.js";
import { ResolverContext } from "./context.js";

export interface Profile {
  userId: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export interface UpdateProfile {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (_parent: { memberTypeId: MemberTypeIdEnum }, _args: unknown, context: ResolverContext) => {
        return await context.prisma.memberType.findUnique({
          where: {
            id: _parent.memberTypeId,
           }
        })
      }
    }
  })
})

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInputType',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId)}
  }
})

export const UpdateProfileInputType = new GraphQLInputObjectType({
  name: 'UpdateProfileInputType',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId)}
  }
})
