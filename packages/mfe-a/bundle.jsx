import React from "react";
import { ApolloProvider, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { createRoot } from "react-dom/client";
import { getClient } from "shared-client";

const client = getClient("mfe-a", "1.0.0");

const EXAMPLE_QUERY = gql`
query ExampleQuery {
  characters {
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
      {data.characters.results.map((character) => (
        <li key={character.name}>{character.name}</li>
      ))}
    </ul>
  );
}


const root = createRoot(document.getElementById("root-a"));
root.render(
  <ApolloProvider client={client}>
    <Data />
  </ApolloProvider>
);
