import activeTripStore from '../stores/ActiveTripStore';
import userStore from '../stores/UserStore';

/**
     * Convert MonthInt to a Month String
     * @param {image} image - image to download
     */
function convertIdToUser(id, userList) {
  if (userList) {
    return userList.find((member) => member.id === id);
  }
  const { activeMembers } = activeTripStore((state) => state.activeTrip);
  const user = activeMembers.find((member) => member.id === id);

  if (!user) {
    return {};
  }

  return user;
}

/**
     * Check if user is host
     * @param {String} userId - User ID
     */
function isHost(userId) {
  const { hostId } = activeTripStore((state) => state.activeTrip);
  const { id: user } = userStore((state) => state.user);
  if (userId) {
    return hostId === userId;
  }
  return hostId === user;
}

export default { convertIdToUser, isHost };
