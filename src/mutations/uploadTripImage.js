import {gql} from '@apollo/client';

const UPLOAD_TRIP_IMAGE = gql`
  mutation UploadTripImage($image: ImageInput!) {
    uploadTripImage(image: $image) {
      _id
      author {
        _id
        avatarUri
        lastName
        firstName
      }
      createdAt
      uri
      title
      description
      userFreeImages
    }
  }
`;

export default UPLOAD_TRIP_IMAGE;
