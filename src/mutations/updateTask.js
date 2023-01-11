import { gql } from '@apollo/client';

const UPDATE_TASK = gql`
    mutation UpdateTask($data: UpdateTaskInput!) {
        updateTask(data: $data)
    }
`;

export default UPDATE_TASK;
