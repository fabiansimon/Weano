import { gql } from '@apollo/client';

const ADD_POLL = gql`
    mutation CreatePoll($poll: PollInput!) {
        createPoll(poll: $poll)
    }  
`;

export default ADD_POLL;
