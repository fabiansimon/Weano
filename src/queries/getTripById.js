import gql from 'graphql-tag';

const GET_TRIP_BY_ID = gql`
    query GetTripById($tripId: String) {
        getTripById(tripId: $tripId) {
            id
            thumbnailUri
            title
            description
            location {
                placeName
                latlon
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

export default GET_TRIP_BY_ID;
