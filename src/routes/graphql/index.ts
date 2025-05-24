import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate, specifiedRules } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { rootQuery } from './queries.js';
import { rootMutation } from './mutations.js';

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
      const { query, variables } = req.body;

      const document = parse(query);

      const validationErrors = validate(
        schema,
        document,
        [
          depthLimit(5),
          ...specifiedRules,
        ]
      );

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });
    },
  });
};

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

export default plugin;
