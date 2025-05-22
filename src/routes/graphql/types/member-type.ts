import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType} from 'graphql';
import { ResolverContext } from './context.js';

export enum MemberIdEnum {
  BASIC = 'BASIC',
  BUSINESS = 'BUSINESS',
}

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberIdEnum.BASIC]: { value: MemberIdEnum.BASIC },
    [MemberIdEnum.BUSINESS]: { value: MemberIdEnum.BUSINESS },
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

