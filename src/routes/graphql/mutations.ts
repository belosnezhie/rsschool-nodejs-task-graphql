import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ProfileType, CreateProfileInputType, Profile, UpdateProfile, UpdateProfileInputType } from "./types/profile-types.js";
import { ResolverContext } from "./types/context.js";
import { UUIDType } from "./types/uuid.js";
import { CreatePostInputType, PostType, UpdatePost, UpdatePostInputType } from "./types/post-types.js";
import { Post } from "@prisma/client";
import { CreateUserInputType, User, UserType } from "./types/user-types.js";

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

    createPost: {
      type: PostType,
      args: {
        data: { type: new GraphQLNonNull(CreatePostInputType) }
      },
      resolve: async (_parent: unknown, _args: { data: Post }, context: ResolverContext) => {
        return await context.prisma.post.create({
          data: _args.data,
        })
      }
    },
    updatePost: {
      type: PostType,
      args: {
        data: { type: new GraphQLNonNull(UpdatePostInputType) },
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { data: UpdatePost, id: string }, context: ResolverContext) => {
        return await context.prisma.post.update({
          where: { id: _args.id },
          data: _args.data,
        })
      }
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        return await context.prisma.post.delete({
          where: { id: _args.id }
        })
      }
    },

    createUser: {
      type: UserType,
      args: {
        data: { type: new GraphQLNonNull(CreateUserInputType) }
      },
      resolve: async (_parent: unknown, _args: { data: User }, context: ResolverContext) => {
        return await context.prisma.user.create({
          data: _args.data,
        })
      }
    },
    updateUser: {
      type: UserType,
      args: {
        data: { type: new GraphQLNonNull(CreateUserInputType) },
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { data: User, id: string }, context: ResolverContext) => {
        return await context.prisma.user.update({
          where: { id: _args.id },
          data: _args.data,
        })
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        return await context.prisma.user.delete({
          where: { id: _args.id }
        })
      }
    },

    subscribeToUser: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, _args: { userId: string; authorId: string }, context: ResolverContext) => {
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: _args.userId,
            authorId: _args.authorId,
          },
        });

        // toDo: fix return value, postman error:
        // "String cannot represent value: { id: \"50e98658-ddd3-4954-837b-eb8e2a715771\", name: \"User To Subscribe\", balance: 4.4 }"
        return await context.prisma.user.findUnique({
          where: {
            id: _args.authorId,
          },
        });
      }
    },

    unsubscribeFromUser: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, _args: { userId: string; authorId: string }, context: ResolverContext) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: _args.userId,
              authorId: _args.authorId,
            },
          },
        });
      }
    }
  }
})
