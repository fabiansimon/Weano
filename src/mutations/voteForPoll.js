import {gql} from '@apollo/client';

const VOTE_FOR_POLL = gql`
  mutation VoteForPoll($data: VoteInput!) {
    voteForPoll(data: $data)
  }
`;

export default VOTE_FOR_POLL;
