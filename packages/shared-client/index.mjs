import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { SetContextLink } from "@apollo/client/link/context";

const link = ApolloLink.from([
  new SetContextLink((previousContext) => {
    // How can I access the name/version of the mfe that issued the operation here?
    console.log(previousContext);
    return {};
  }),
  new BatchHttpLink({
    uri: "https://rickandmortyapi.com/graphql",
    batchMax: 5, // No more than 5 operations per batch
    batchInterval: 20, // Wait no more than 20ms after first batched operation
  }),
]);

const cache = new InMemoryCache();

export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link,

  // Provide some optional constructor fields
  name: "shared-client",
  version: "1.0.0",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
