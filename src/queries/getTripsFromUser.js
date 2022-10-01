import gql from 'graphql-tag';

const GET_TRIPS_FROM_USER = gql`
    query GetAllTrips {
        getAllTrips {
            id
            title
            location
            invitees
            startDate
            endDate
        }
    }
`;

export default GET_TRIPS_FROM_USER;
