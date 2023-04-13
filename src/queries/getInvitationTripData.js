import gql from 'graphql-tag';

const GET_INVITATION_TRIP_DATA = gql`
  query GetInvitationTripData($tripId: String) {
    getInvitationTripData(tripId: $tripId) {
      title
      description
      dateRange {
        startDate
        endDate
      }
      location {
        placeName
        latlon
      }
      hostName
    }
  }
`;

export default GET_INVITATION_TRIP_DATA;
