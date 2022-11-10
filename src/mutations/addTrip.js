import { gql } from '@apollo/client';

const ADD_TRIP = gql`
    mutation CreateTrip($trip: TripInput) {
        createTrip(trip: $trip)
    }  
`;

export default ADD_TRIP;
