import { GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";

export interface User {
  name: string;
  balance: number;
}


  // id: UUID!
  // name: String!
  // balance: Float!
  // profile: Profile
  // posts: [Post!]!
  // userSubscribedTo: [User!]!
  // subscribedToUser: [User!]!

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }
})

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInputType',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }
})
