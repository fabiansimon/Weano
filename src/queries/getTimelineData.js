import gql from 'graphql-tag';

const GET_TIMELINE_DATA = gql`
    query GetTripById($tripId: String) {
        getTripById(tripId: $tripId) {
            images {
                author
                createdAt
                description
                title
                uri
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
                createdAt
                creatorId
                title
                isDone
            }
        }
    }
`;

export default GET_TIMELINE_DATA;
