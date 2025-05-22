import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { MemberTypeId } from './types/member-type.js';
import { ResolverContext } from './types/context.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma }
      });
    },
  });
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'MemberTypesQuery',
    fields: {
      // hello: {
      //   type: GraphQLString,
      //   resolve: async () => {
      //     return 'Hello world!';
      //   }
      // },
      memberTypes: {
        type: new GraphQLList(new GraphQLObjectType({
          name: 'MemberType',
          fields: {
            id: { type: new GraphQLEnumType({
                name: 'MemberTypeId',
                values: {
                  [MemberTypeId.BASIC]:{ value: MemberTypeId.BASIC},
                  [MemberTypeId.BUSINESS]:{ value: MemberTypeId.BUSINESS},
                }
              })
            },
            discount: {
              type: new GraphQLNonNull(GraphQLFloat),
            },
            postsLimitPerMonth: {
              type: new GraphQLNonNull(GraphQLInt)
            }

          }
        })),
        resolve: async (_parent: unknown, _args: unknown, context: ResolverContext) => {
          const data = await context.prisma.memberType.findMany();
          return data;
        }
      }
    }
  })
});

export default plugin;
