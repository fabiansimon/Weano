import {gql} from '@apollo/client';

const ADD_PACKING_LIST = gql`
  mutation CreatePackingList($packingData: PackingListInput!) {
    createPackingList(packingData: $packingData) {
      _id
      title
      amount
      isPacked
    }
  }
`;

export default ADD_PACKING_LIST;
