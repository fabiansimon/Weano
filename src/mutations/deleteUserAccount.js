import {gql} from '@apollo/client';

const DELETE_USER = gql`
  mutation Mutation {
    deleteUser
  }
`;

export default DELETE_USER;
