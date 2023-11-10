import {gql} from '@apollo/client';

const UPLOAD_DOCUMENT = gql`
  mutation UploadDocument($document: DocumentInput!) {
    uploadDocument(document: $document) {
      _id
      title
      uri
      creatorId
      type
      createdAt
    }
  }
`;

export default UPLOAD_DOCUMENT;
