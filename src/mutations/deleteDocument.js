import { gql } from '@apollo/client';

const DELETE_DOCUMENT = gql`
    mutation DeleteDocument($data: DeleteInput!) {
        deleteDocument(data: $data)
    }  
`;

export default DELETE_DOCUMENT;
