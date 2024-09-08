import { GraphQLContext, ICardArgs } from "./_types";

const resolvers = {
  Query: {
    card: async (parent: unknown, args: ICardArgs, context: GraphQLContext) => {
      const response = await context.axios.get("", {
        params: args,
      });
      return response.data.data;
    },
  },
};

export default resolvers;
