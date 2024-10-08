// ApolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: "http://127.0.0.1:8000/subgraphs/name/Uniswap-Subgraph", // Replace with your GraphQL API endpoint
  cache: new InMemoryCache(),
});

export default client;