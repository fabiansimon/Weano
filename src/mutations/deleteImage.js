import {gql} from '@apollo/client';

const DELETE_IMAGE = gql`
  mutation DeleteImage($data: DeleteInput!) {
    deleteImage(data: $data)
  }
`;

export default DELETE_IMAGE;
