import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { SetContextLink } from "@apollo/client/link/context";
// import { ClientAwarenessLink } from "@apollo/client/link/client-awareness";

const link = ApolloLink.from([
  new SetContextLink((previousContext) => {
    // How can I access the name/version of the MFE that issued the operation here?
    console.log(previousContext);
    return {};
  }),
  // This also won't work because it's not specific to the MFE
  // new ClientAwarenessLink({
  //   name: "shared-client",
  //   version: "1.0.0",
  // }),
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
