import gql from 'graphql-tag';

const GET_IMAGES_FROM_TRIP = gql`
    query GetImagesFromTrip($tripId: String) {
        getImagesFromTrip(tripId: $tripId) {
            userFreeImages
            images {
                createdAt
                uri
                title
                description
                author {
                    firstName
                    lastName
                    avatarUri
                }
            }
        }
    }
`;

export default GET_IMAGES_FROM_TRIP;
