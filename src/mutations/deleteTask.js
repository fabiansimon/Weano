import {gql} from '@apollo/client';

const DELETE_TASK = gql`
  mutation DeleteTask($data: DeleteInput!) {
    deleteTask(data: $data)
  }
`;

export default DELETE_TASK;
