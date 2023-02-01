import { gql } from '@apollo/client';

const REMOVE_USER_FROM_TRIP = gql`
    mutation RemoveUserFromTrip($data: DeleteInput!) {
        removeUserFromTrip(data: $data)
    }  
`;

export default REMOVE_USER_FROM_TRIP;
