import { Post, PrismaClient, Profile, MemberType } from "@prisma/client";
import DataLoader from "dataloader";

export const createLoaders = (prisma: PrismaClient) => {
  return {
    memberTypeLoader: new DataLoader(async (memberTypeIds: readonly string[]) => {
      const memberTypes = await prisma.memberType.findMany({
        where: {
          profiles: {
            some: {
              memberTypeId: {
                in: [...memberTypeIds],
              }
            }
          }
        },
      });

      const memberTypeMap = new Map<string, MemberType>();

      memberTypes.forEach((memberType) => {
        memberTypeMap.set(memberType.id, memberType)
      })

      return memberTypeIds.map((id) => memberTypeMap.get(id) ?? []);
    }),

    profileLoader: new DataLoader(async (userIds: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: {
          userId: { in: userIds as string[] }
        },
      });

      const profileMap = new Map<string, Profile>();

      profiles.forEach((profile) => {
        profileMap.set(profile.userId, profile);
      })

      return userIds.map((id) => profileMap.get(id) ?? null);
    }),

    postLoader: new DataLoader<string, Post[]>(async (authorIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: authorIds as string[] }
        },
      });

      const postMap = new Map<string, Post[]>();

      posts.forEach((post) => {
        if (postMap.get(post.authorId)) {
          postMap.get(post.authorId)?.push(post);
        } else {
          postMap.set(post.authorId, [post])
        }
      })

      return authorIds.map((id) => postMap.get(id) ?? []);
    }),

    userSubscribedToLoader: new DataLoader(async (subscriberIds: readonly string[]) => {
      const subscriptions = await prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: { in: subscriberIds as string[] }
            }
          }
        },
        include: {
          subscribedToUser: true,
        }
      });

      const map = new Map<string, typeof subscriptions>();

      for (const user of subscriptions) {
        for (const { subscriberId } of user.subscribedToUser) {
          if (!map.has(subscriberId)) {
            map.set(subscriberId, []);
          }
          map.get(subscriberId)!.push(user);
        }
      }

      return subscriberIds.map((subscriberId) => map.get(subscriberId) || []);
    }),

    subscribedToUserLoader: new DataLoader(async (authorIds: readonly string[]) => {
      const subscriptions = await prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: { in: authorIds as string[] }
            }
          }
        },
        include: {
          userSubscribedTo: true,
        }
      });

      const map = new Map<string, typeof subscriptions>();

      for (const user of subscriptions) {
        for (const { authorId } of user.userSubscribedTo) {
          if (!map.has(authorId)) {
            map.set(authorId, []);
          }
          map.get(authorId)!.push(user);
        }
      }

      return authorIds.map((authorId) => map.get(authorId) || []);
    })
  };
}
