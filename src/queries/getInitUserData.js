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
                friends
                countriesVisited
                isProMember
            }
            freeTierLimits 
            premiumTierLimits
            trips {
                userFreeImages
                type
                id
                images {
                    _id
                }
                thumbnailUri
                title
                destinations {
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
            }
        }
    }
`;

export default GET_INIT_USER_DATA;
