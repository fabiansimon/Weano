import {gql} from '@apollo/client';

const REGISTER_USER = gql`
  mutation RegisterUser($user: RegisterUserInput!) {
    registerUser(user: $user)
  }
`;

export default REGISTER_USER;
