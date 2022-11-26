import { gql } from '@apollo/client';

const JOIN_TRIP = gql`
    mutation JoinTrip($tripId: ID) {
        joinTrip(tripId: $tripId)
    }  
`;

export default JOIN_TRIP;
