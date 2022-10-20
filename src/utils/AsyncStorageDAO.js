import AsyncStorage from '@react-native-async-storage/async-storage';

const keys = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  userData: 'userData',
  isAuth: 'isAuth',
  transactionData: 'transactionData',
  blePermissionEnabled: 'blePermissionEnabled',
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

  async setRefreshToken(token) {
    try {
      await AsyncStorage.setItem(keys.refreshToken, token);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }

  async getRefreshToken() {
    try {
      const accessToken = await AsyncStorage.getItem(keys.refreshToken);
      return accessToken;
    } catch (error) {
      return Promise.reject();
    }
  }

  setUserData(data) {
    return AsyncStorage.setItem(keys.userData, JSON.stringify(data));
  }

  getUserData() {
    return AsyncStorage.getItem(keys.userData);
  }

  setIsAuth(val) {
    return AsyncStorage.setItem(keys.isAuth, JSON.stringify(val));
  }

  getIsAuth() {
    return AsyncStorage.getItem(keys.isAuth);
  }

  saveTransactionData({
    transactionId,
    garageId,
    completed,
    showMidgateway,
    exitType,
    gatewayKey,
  }) {
    return AsyncStorage.setItem(
      keys.transactionData,
      JSON.stringify({
        transactionId,
        garageId,
        completed,
        showMidgateway,
        exitType,
        gatewayKey, // BE
      }),
    );
  }

  async getTransactionData() {
    const data = await AsyncStorage.getItem(keys.transactionData);
    return JSON.parse(data);
  }

  clearTransactionData() {
    return AsyncStorage.removeItem(keys.transactionData);
  }

  setBlePermissionEnabled(data) {
    return AsyncStorage.setItem(
      keys.blePermissionEnabled,
      JSON.stringify(data),
    );
  }

  getBlePermissionEnabled() {
    return AsyncStorage.getItem(keys.blePermissionEnabled);
  }
}

export default AsyncStorageDAO;
