import gql from 'graphql-tag';

const GET_TRIP_BY_ID = gql`
  query GetTripById($tripId: String) {
    getTripById(tripId: $tripId) {
      currency {
        symbol
        string
      }
      userFreeImages
      id
      hostId
      thumbnailUri
      title
      description
      type
      destinations {
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
      }
      dateRange {
        startDate
        endDate
      }
      expenses {
        _id
        creatorId
        paidBy
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
      documents {
        _id
        title
        createdAt
        creatorId
        type
        uri
      }
      packingItems {
        title
        isPacked
        amount
        _id
      }
    }
  }
`;

export default GET_TRIP_BY_ID;
