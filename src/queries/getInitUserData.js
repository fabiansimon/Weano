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
                expenses {
                    expense
                    trip
                }
            }
            trips {
                id
                thumbnailUri
                title
                location
                expenses {
                    amount
                    title
                    creatorId
                    createdAt
                    currency
                }
                invitees {
                    phoneNumber
                    status
                }
                activeMembers {
                    id
                    phoneNumber
                    avatarUri
                    email
                    firstName
                    lastName
                    images
                    trips
                }
                dateRange {
                    startDate
                    endDate
                }
            }
            activeTrip {
                id
                title
                description
                location
                thumbnailUri
                expenses {
                    createdAt
                    creatorId
                    title
                    amount
                    currency
                }
                activeMembers {
                    id
                    phoneNumber
                    avatarUri
                    email
                    firstName
                    lastName
                    images
                    trips
                    expenses {
                        expense
                        trip
                    }
                }
                invitees {
                    phoneNumber
                    status
                }
                dateRange {
                    startDate
                    endDate
                }
                images
            }
            recapTrip {
                id
                title
                location
                expenses {
                    createdAt
                    creatorId
                    title
                    amount
                    currency
                }
                activeMembers {
                    id
                    phoneNumber
                    avatarUri
                    email
                    firstName
                    lastName
                    images
                    trips
                    expenses {
                    expense
                    trip
                    }
                }
                invitees {
                    phoneNumber
                    status
                }
                dateRange {
                    startDate
                    endDate
                }
                images
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
