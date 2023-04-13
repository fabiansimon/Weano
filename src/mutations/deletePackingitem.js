import {gql} from '@apollo/client';

const DELETE_PACKING_ITEM = gql`
  mutation DeletePackingItem($data: DeleteInput!) {
    deletePackingItem(data: $data)
  }
`;

export default DELETE_PACKING_ITEM;
