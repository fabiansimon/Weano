import activeTripStore from '../stores/ActiveTripStore';
import userStore from '../stores/UserStore';
import i18n from './i18n';

/**
 * Convert MonthInt to a Month String
 * @param {image} image - image to download
 */
function convertIdToUser(id, userList) {
  if (userList) {
    return userList.find(member => member.id === id);
  }
  const {activeMembers} = activeTripStore(state => state.activeTrip);
  const user = activeMembers.find(member => member.id === id);

  if (!user) {
    return {
      firstName: i18n.t('deleted user'),
      lastName: '',
    };
  }

  return user;
}

/**
 * Check if user is host
 * @param {String} userId - User ID
 */
function isHost(userId) {
  const {hostIds} = activeTripStore(state => state.activeTrip);
  const {id: user} = userStore(state => state.user);

  if (!hostIds) {
    return false;
  }

  if (userId) {
    return hostIds.includes(userId);
  }
  return hostIds.includes(user);
}

export default {convertIdToUser, isHost};
