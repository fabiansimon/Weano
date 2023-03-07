import AsyncStorage from '@react-native-async-storage/async-storage';

const keys = {
  accessToken: 'access_token',
  isAuth: 'isAuth',
  freeTierLimits: 'freeTierLimits',
  premiumTierLimits: 'premiumTierLimits',
};

class AsyncStorageDAO {
  static get keys() {
    return keys;
  }

  logout() {
    return AsyncStorage.clear();
  }

  setAccessToken(token) {
    return AsyncStorage.setItem(keys.accessToken, token);
  }

  getAccessToken() {
    return AsyncStorage.getItem(keys.accessToken);
  }

  clearAccessToken() {
    return AsyncStorage.removeItem(keys.accessToken);
  }

  setIsAuth(val) {
    return AsyncStorage.setItem(keys.isAuth, JSON.stringify(val));
  }

  getIsAuth() {
    return AsyncStorage.getItem(keys.isAuth);
  }

  setFreeTierLimits(val) {
    return AsyncStorage.setItem(keys.freeTierLimits, val);
  }

  async getFreeTierLimits() {
    return AsyncStorage.getItem(keys.freeTierLimits);
  }

  setPremiumTierLimits(val) {
    return AsyncStorage.setItem(keys.premiumTierLimits, val);
  }

  async getPremiumTierLimits() {
    return AsyncStorage.getItem(keys.premiumTierLimits);
  }
}

export default AsyncStorageDAO;
