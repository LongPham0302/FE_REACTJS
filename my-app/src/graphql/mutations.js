import { gql } from 'graphql-tag';

export const CreateUserInput = gql`
  input RegisterInput {
    email: String!
    name: String
    password: String!
    description: String
    avatarExternalUrl: String
    dateOfBirth: String
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($registerInput: CreateUserInput!) {
    signup(registerInput: $registerInput) {
      token,
      status,
    }
  }
`;

export const LoginUserInput = gql`
  input LoginUserInput {
    email: String!
    password: String!
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginUserInput!) {
    login(loginInput: $loginInput) {
      token,
      status,
      userId

    }
  }
`;
export const UpdateUserInput = gql`  
input UpdateUserInput {
  _id: ID!
  name: String
  description: String
  avatarExternalUrl: String
  dateOfBirth: String
}
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($updateUser: UpdateUserInput!) {
    updateUser(updateUser: $updateUser) {
      name
      email
      description
      avatarExternalUrl
      dateOfBirth
    }
  }
`;
