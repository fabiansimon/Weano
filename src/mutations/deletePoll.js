import { gql } from '@apollo/client';

const DELETE_POLL = gql`
    mutation DeleteTask($data: DeleteInput!) {
        deletePoll(data: $data)
    }  
`;

export default DELETE_POLL;
