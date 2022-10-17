import { gql } from '@apollo/client';

const UPLOAD_IMAGE = gql`
    mutation UploadImage($image: ImageInput!) {
        uploadImage(image: $image) 
    }
`;

export default UPLOAD_IMAGE;
