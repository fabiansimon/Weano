import { gql } from '@apollo/client';

const DELETE_TRIP_BY_ID = gql`
    mutation DeleteTripById($tripId: ID) {
        deleteTripById(tripId: $tripId)
    }  
`;

export default DELETE_TRIP_BY_ID;
