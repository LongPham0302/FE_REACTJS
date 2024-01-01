import { gql } from 'graphql-tag';

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(id: $userId) {
      _id
      name
      email
      description
      avatarExternalUrl
      dateOfBirth
    }
  }
`;