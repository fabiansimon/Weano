import gql from 'graphql-tag';

const CHECK_FREE_IMAGES = gql`
    query GetImagesFromTrip($tripId: String) {
        getImagesFromTrip(tripId: $tripId) {
            userFreeImages
        }
    }
`;

export default CHECK_FREE_IMAGES;
