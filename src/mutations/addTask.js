import { gql } from '@apollo/client';

const ADD_TASK = gql`
    mutation CreateTask($task: TaskInput!) {
        createTask(task: $task)
    }  
`;

export default ADD_TASK;
