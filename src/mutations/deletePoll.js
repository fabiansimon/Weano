import { gql } from '@apollo/client';

const DELETE_POLL = gql`
    mutation DeletePoll($data: DeleteInput!) {
        deletePoll(data: $data)
    }  
`;

export default DELETE_POLL;
