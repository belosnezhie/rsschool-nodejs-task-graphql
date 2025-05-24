import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ProfileType, CreateProfileInput, Profile, UpdateProfile, ChangeProfileInput } from "./types/profile-types.js";
import { ResolverContext } from "./types/context.js";
import { UUIDType } from "./types/uuid.js";
import { CreatePostInput, PostType, UpdatePost, ChangePostInput } from "./types/post-types.js";
import { Post } from "@prisma/client";
import { ChangeUserInput, CreateUserInput, User, UserType } from "./types/user-types.js";

export const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) }
      },
      resolve: async (_parent: unknown, _args: { dto: Profile }, context: ResolverContext) => {
        return await context.prisma.profile.create({
          data: _args.dto,
        })
      }
    },
    changeProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { dto: UpdateProfile, id: string }, context: ResolverContext) => {
        return await context.prisma.profile.update({
          where: { id: _args.id },
          data: _args.dto,
        })
      }
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        const profile = await context.prisma.profile.delete({
          where: { id: _args.id }
        })

        return profile.id;
      }
    },

    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) }
      },
      resolve: async (_parent: unknown, _args: { dto: Post }, context: ResolverContext) => {
        return await context.prisma.post.create({
          data: _args.dto,
        })
      }
    },
    changePost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(ChangePostInput) },
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { dto: UpdatePost, id: string }, context: ResolverContext) => {
        return await context.prisma.post.update({
          where: { id: _args.id },
          data: _args.dto,
        })
      }
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        const post = await context.prisma.post.delete({
          where: { id: _args.id }
        })

        return post.id
      }
    },

    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) }
      },
      resolve: async (_parent: unknown, _args: { dto: User }, context: ResolverContext) => {
        return await context.prisma.user.create({
          data: _args.dto,
        })
      }
    },
    changeUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { dto: User, id: string }, context: ResolverContext) => {
        return await context.prisma.user.update({
          where: { id: _args.id },
          data: _args.dto,
        })
      }
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_parent: unknown, _args: { id: string }, context: ResolverContext) => {
        const user = await context.prisma.user.delete({
          where: { id: _args.id }
        })

        return user.id;
      }
    },

    subscribeTo: {
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

        const user = await context.prisma.user.findUnique({
          where: {
            id: _args.authorId,
          },
        });

        return user?.id;
      }
    },

    unsubscribeFrom: {
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
