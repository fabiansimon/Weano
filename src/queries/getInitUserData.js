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
                location {
                    placeName
                    latlon
                }
                expenses {
                    amount
                    title
                    creatorId
                    createdAt
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
                location {
                    placeName
                    latlon
                }
                thumbnailUri
                expenses {
                    createdAt
                    creatorId
                    title
                    amount
                    currency
                }
                mutualTasks {
                    creatorId
                    assignee
                    title
                    isDone
                }
                privateTasks {
                    creatorId
                    title
                    isDone
                }
                polls {
                    creatorId
                    title
                    description
                    createdAt
                    options {
                        option
                        votes
                        creatorId
                    }
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
                dateRange {
                    startDate
                    endDate
                }
            }
            recapTrip {
                id
                title
                location {
                    placeName
                    latlon
                }
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
