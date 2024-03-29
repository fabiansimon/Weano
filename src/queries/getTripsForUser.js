import gql from 'graphql-tag';

const GET_TRIPS_FOR_USER = gql`
  query GetTripsForUser {
    getTripsForUser {
      type
      userFreeImages
      id
      thumbnailUri
      title
      description
      destinations {
        placeName
        latlon
      }
      activeMembers {
        id
        avatarUri
        firstName
        lastName
      }
      openTasks {
        _id
        assignee
        title
      }
      dateRange {
        startDate
        endDate
      }
      images {
        _id
        description
        title
        uri
      }
    }
  }
`;

export default GET_TRIPS_FOR_USER;
