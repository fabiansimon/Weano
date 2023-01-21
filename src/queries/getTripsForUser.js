import gql from 'graphql-tag';

const GET_TRIPS_FOR_USER = gql`
    query GetTripsForUser {
        getTripsForUser {
            id
            thumbnailUri
            title
            description
            location {
                placeName
                latlon
            }
            dateRange {
                startDate
                endDate
            }
            images {
                _id
                description
                title
                uri
            }
        }
    }
`;

export default GET_TRIPS_FOR_USER;
