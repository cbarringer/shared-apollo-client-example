# Shared Apollo Client Example

When multiple micro-front-ends (MFEs) are loaded on a single page, connecting to the same GraphQL endpoint, we would like those MFEs to share the same Apollo Client instance. This allows us to take advantage of Apollo's caching and batching features, as well as the ability to share data between MFEs.

We would *also* like to be able to identify which MFE issued the operation, so that we can segment by MFE in the GraphOS Studio Insights tab.

In this repo we have two MFEs, [`mfe-a`](./packages/mfe-a/bundle.jsx) and [`mfe-b`](./packages/mfe-b/bundle.jsx), that both connect to the same GraphQL endpoint. They both use the [same Apollo Client instance](./packages/shared-client/index.mjs), but there is no clear path to distinguish in that client _which_ MFE issued the operation.

The `SetContextLink` can be used to set the client headers for the operation, but it doesn't provide a way to distinguish between MFEs. Similarly, the `ClientAwarenessLink` can be used to set the client headers for the operation, but it doesn't provide a way to distinguish between MFEs.

So how do we send the right client headers for each MFE when those MFEs share a single Apollo Client instance?

# Option 1: Add client headers to each react hook call
```jsx
const { loading, error, data } = useQuery(EXAMPLE_QUERY, {
  context: {
    clientAwareness: {
      name: 'mfe-a',
      version: '1.0.0',
    },
  },
});
```

This option would certainly work, but this is a _lot_ of boilerplate to add to every GraphQL operation in every component of every MFE.

# Option 2: Share links and cache, but not the client
```js
import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { ClientAwarenessLink } from "@apollo/client/link/client-awareness";

const batchHttpLink = new BatchHttpLink({
  uri: "https://rickandmortyapi.com/graphql",
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
    batchHttpLink,
  ]);

  return new ApolloClient({
    cache,
    link,
  });
});
```

This has the advantage of sharing the same cache and links between MFEs and allows for the client awareness to be specific to the invoking MFE. What's not clear is if sharing a link and a cache across different clients is in fact supported by the `@apollo/client` library.

# Option 3: Add an optional `defaultContext` prop to the `ApolloProvider` component
```jsx
<ApolloProvider client={client} defaultContext={{
  clientAwareness: {
    name: 'mfe-a',
    version: '1.0.0',
  },
}} />
```

This approach would allow the client to be injected from the MFE through the default context, but is potentially a large lift to add this capability to the `@apollo/client` library.

# Option 4: Create a wrapper library around `@apollo/client` that automatically injects client awareness

This is essentially the same as option 1, but rather than having boilerplate code in the apps, the boilerplate code is moved to a wrapper library. This approach works, but requires us to maintain a wrapper library, which is a bit of a maintenance burden.
