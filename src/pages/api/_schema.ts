import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./_schemas";
import resolvers from "./_resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
