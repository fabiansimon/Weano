import gql from 'graphql-tag';

const GET_INIT_USER_DATA = gql`
    query GetUserInitData {
        getUserInitData {
            userData {
                id
                avatarUri
                email
                firstName
                lastName
                phoneNumber
                images
                trips
            }
            images {
                uri
                description
                title
            }
            trips {
                id
                title
                location
                invitees {
                    phoneNumber
                    status
                }
                dateRange {
                    startDate
                    endDate
                }
            }
        }
    }
`;

export default GET_INIT_USER_DATA;
