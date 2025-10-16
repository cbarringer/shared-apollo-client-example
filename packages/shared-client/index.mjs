import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { ClientAwarenessLink } from "@apollo/client/link/client-awareness";

const batchLink = new BatchHttpLink({
  uri: "https://rickandmortyapi.com/graphql",
  batchMax: 5, // No more than 5 operations per batch
  batchInterval: 500, // Wait no more than 2000ms after first batched operation
});

const cache = new InMemoryCache();

export function getClient(name, version) {
  const link = ApolloLink.from([
    new ClientAwarenessLink({
      clientAwareness: {
        name,
        version,
      },
    }),
    batchLink,
  ]);
  return new ApolloClient({
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
}
