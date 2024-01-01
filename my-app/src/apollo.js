import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
    credentials: 'omit', // Hoặc có thể là 'same-origin'
});

export default client;
