import gql from 'graphql-tag';

const GET_IMAGES_FROM_TRIP = gql`
    query GetImagesFromTrip($tripId: String) {
        getImagesFromTrip(tripId: $tripId) {
            userFreeImages
            images {
                _id
                createdAt
                uri
                title
                description
                author {
                    _id
                    firstName
                    lastName
                    avatarUri
                }
            }
        }
    }
`;

export default GET_IMAGES_FROM_TRIP;
