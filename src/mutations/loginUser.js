import { gql } from '@apollo/client';

const LOGIN_USER = gql`
    mutation LoginUser($user: LoginUserInput!) {
        loginUser(user: $user)
    }
`;

export default LOGIN_USER;
