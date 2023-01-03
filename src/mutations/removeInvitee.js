import { gql } from '@apollo/client';

const REMOVE_INVITEE = gql`
    mutation RemoveInvitee($data: RemoveInviteeInput!) {
        removeInvitee(data: $data)
    }  
`;

export default REMOVE_INVITEE;
