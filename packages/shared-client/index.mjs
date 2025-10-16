import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();

export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",

  // Provide some optional constructor fields
  name: "shared-client",
  version: "1.0.0",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
