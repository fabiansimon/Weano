import firestore from '@react-native-firebase/firestore';
import activeTripStore from '../stores/ActiveTripStore';

const store = firestore();

async function deleteChatRoom(id) {
  return new Promise((resolve, reject) => {
    store
      .collection('tripChats')
      .doc(id)
      .delete()
      .then(res => {
        resolve(res);
      })
      .catch(e => reject(e));
  });
}

async function fetchChatData(id, limit, offset = 0) {
  return new Promise((resolve, reject) => {
    store
      .collection('tripChats')
      .doc(id)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .startAt()
      .limitToLast(limit)
      .get()
      .then(res => {
        const {_docs} = res;
        resolve(_docs.map(({_data}) => _data));
      })
      .catch(e => reject(e));
  });
}

async function sendMessage(id, message) {
  return new Promise((resolve, reject) => {
    store
      .collection('tripChats')
      .doc(id)
      .collection('messages')
      .add(message)
      .then(res => {
        resolve(res);
      })
      .catch(e => reject(e));
  });
}

export default {
  sendMessage,
  fetchChatData,
  deleteChatRoom,
};
