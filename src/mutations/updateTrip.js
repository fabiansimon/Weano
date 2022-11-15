import { gql } from '@apollo/client';

const UPDATE_TRIP = gql`
    mutation UpdateTrip($trip: UpdatedTripInput!) {
        updateTrip(trip: $trip) 
    }
`;

export default UPDATE_TRIP;
