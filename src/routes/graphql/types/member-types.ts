import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType} from 'graphql';

export enum MemberTypeIdEnum {
  BASIC = 'BASIC',
  BUSINESS = 'BUSINESS',
}

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeIdEnum.BASIC]: { value: MemberTypeIdEnum.BASIC },
    [MemberTypeIdEnum.BUSINESS]: { value: MemberTypeIdEnum.BUSINESS },
  }
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: {
      type: new GraphQLNonNull(MemberTypeId),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  }
})

