import gql from 'graphql-tag';

const GET_INVITATION_TRIP_DATA = gql`
  query GetTripById($tripId: String) {
    getTripById(tripId: $tripId, isInvitation: true) {
      id
      hostIds
      thumbnailUri
      title
      description
      type
      destinations {
        placeName
        latlon
      }
      activeMembers {
        avatarUri
      }
      dateRange {
        startDate
        endDate
      }
    }
  }
`;

export default GET_INVITATION_TRIP_DATA;
