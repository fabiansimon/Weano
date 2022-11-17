import { gql } from '@apollo/client';

const UPLOAD_TRIP_IMAGE = gql`
    mutation UploadTripImage($image: ImageInput!) {
        uploadTripImage(image: $image) 
    }
`;

export default UPLOAD_TRIP_IMAGE;
