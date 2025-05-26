import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

interface Loaders {
  memberTypeLoader: DataLoader<string, MemberType>;
  profileLoader: DataLoader<string, Profile>;
  postLoader: DataLoader<string, Post[]>;
  userSubscribedToLoader: DataLoader<string, User>;
  subscribedToUserLoader: DataLoader<string, User>;
}

export interface ResolverContext {
  prisma: PrismaClient;
  loaders: Loaders;
}
