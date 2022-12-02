import gql from 'graphql-tag';

const GET_TRIP_BY_ID = gql`
    query GetTripById($tripId: String) {
        getTripById(tripId: $tripId) {
            images {
                uri
                title
                description
                author
                createdAt
            }
            expenses {
                creatorId
                title
                amount
                currency
                createdAt
            }
        }
    }
`;

export default GET_TRIP_BY_ID;
