import { gql } from '@apollo/client';

const UPDATE_USER = gql`
    mutation UpdateUser($user: UserInput) {
        updateUser(user: $user) 
    }
`;

export default UPDATE_USER;
