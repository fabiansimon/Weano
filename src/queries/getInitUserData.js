import gql from 'graphql-tag';

const GET_INIT_USER_DATA = gql`
    query GetUserInitData {
        getUserInitData {
            userData {
                id
                phoneNumber
                avatarUri
                email
                firstName
                lastName
                images
                trips
                pushToken
                expenses {
                    expense
                    trip
                }
            }
            trips {
                id
                thumbnailUri
                title
                location {
                    placeName
                    latlon
                }
                description
                dateRange {
                    startDate
                    endDate
                }
                openTasks {
                    _id
                    assignee
                    title
                }
                activeMembers {
                    id
                    avatarUri
                    firstName
                    lastName
                }
                images {
                    _id
                    uri
                }
            }
            images {
                uri
                title
                description
                author
            }
        }
    }
`;

export default GET_INIT_USER_DATA;
