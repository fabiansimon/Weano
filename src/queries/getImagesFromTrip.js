import gql from 'graphql-tag';

const GET_IMAGES_FROM_TRIP = gql`
    query GetImagesFromTrip($tripId: String) {
        getImagesFromTrip(tripId: $tripId) {
            uri
            title
            description
            author
        }
    }
`;

export default GET_IMAGES_FROM_TRIP;
