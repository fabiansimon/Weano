import gql from 'graphql-tag';

const GET_TRIPS_FOR_USER = gql`
    query GetTripsForUser {
        getTripsForUser {
            id
            thumbnailUri
            title
            description
            location {
                placeName
                latlon
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
            expenses {
                creatorId
                title
                amount
                currency
                createdAt
            }
            images
            mutualTasks {
                assignee
                creatorId
                title
                isDone
            }
            privateTasks {
                assignee
                creatorId
                title
                isDone
            }
        }
    }
`;

export default GET_TRIPS_FOR_USER;
