import { gql } from '@apollo/client';

const ADD_TRIP = gql`
    mutation CreateTrip($trip: TripInput) {
        createTrip(trip: $trip) {
            id
            title
            location
            invitees
            startDate
            endDate
        }
    }  
`;

export default ADD_TRIP;
