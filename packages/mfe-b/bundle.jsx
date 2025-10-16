import React from "react";
import { ApolloProvider, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { createRoot } from "react-dom/client";
import { client } from "shared-client";

const EXAMPLE_QUERY = gql`
query ExampleQuery {
  locations {
    results {
      name
    }
  }
}
`;

function Data() {
  const { loading, error, data } = useQuery(EXAMPLE_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <ul>
      {data.locations.results.map((location) => (
        <li key={location.name}>{location.name}</li>
      ))}
    </ul>
  );
}


const root = createRoot(document.getElementById("root-b"));
root.render(
  <ApolloProvider client={client}>
    <Data />
  </ApolloProvider>
);
