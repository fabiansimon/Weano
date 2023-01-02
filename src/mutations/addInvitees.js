import { gql } from '@apollo/client';

const ADD_INVITEES = gql`
    mutation AddInvitees($data: AddInviteeInput!) {
        addInvitees(data: $data)
    }  
`;

export default ADD_INVITEES;
