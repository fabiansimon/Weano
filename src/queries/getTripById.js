import gql from 'graphql-tag';

const GET_TRIP_BY_ID = gql`
    query GetTripById($tripId: String) {
        getTripById(tripId: $tripId) {
            id
            hostId
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
                _id
                creatorId
                title
                amount
                currency
                createdAt
            }
            polls {
                _id
                creatorId
                title
                description
                createdAt
                options {
                    option
                    votes
                    creatorId
                    id
                }
            }
            mutualTasks {
                _id
                assignee
                creatorId
                title
                isDone
            }
            privateTasks {
                _id
                assignee
                creatorId
                title
                isDone
            }
        }
    }
`;

export default GET_TRIP_BY_ID;
