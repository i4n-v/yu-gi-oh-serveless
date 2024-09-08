import { GraphQLContext, ICardArgs } from "./_types";

const resolvers = {
  Query: {
    cards: async (
      parent: unknown,
      { page, limit, ...params }: ICardArgs,
      context: GraphQLContext
    ) => {
      const response = await context.axios.get("", {
        params,
      });
      let cards = response.data.data;
      const totalItems = cards.length;
      let totalPages = 0;

      if (page && limit) {
        totalPages = Math.ceil(cards.length / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        cards = cards.slice(startIndex, endIndex);
      }

      return {
        items: cards,
        totalPages,
        totalItems,
        currentPage: page ?? 0,
      };
    },
  },
};

export default resolvers;
