import {gql} from '@apollo/client';

const UPDATE_PACKING_ITEM = gql`
  mutation UpdatePackingItem($data: UpdatePackingItemInput!) {
    updatePackingItem(data: $data)
  }
`;

export default UPDATE_PACKING_ITEM;
