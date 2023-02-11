import { gql } from '@apollo/client';

const ADD_POLL = gql`
    mutation CreatePoll($poll: PollInput!) {
        createPoll(poll: $poll) {
            id
            options {
                creatorId
                id
                votes
                option
            }
        }
    }  
`;

export default ADD_POLL;
