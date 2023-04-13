import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Feather';
import {View, NativeModules, StyleSheet, Dimensions} from 'react-native';
import i18n from '../utils/i18n';
import COLORS, {PADDING} from '../constants/Theme';
import Utils from '../utils';
import Subtitle from '../components/typography/Subtitle';

const {StatusBarManager} = NativeModules;

const NoInternetContext = createContext();

const InternetCheckProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    NetInfo.configure({
      reachabilityUrl: 'https://clients3.google.com/generate_204',
      reachabilityTest: async response => response.status === 204,
      reachabilityLongTimeout: 10 * 1000, // 10s
      reachabilityShortTimeout: 5 * 1000, // 5s
      reachabilityRequestTimeout: 10 * 1000, // 10s
      reachabilityShouldRun: () => true,
      shouldFetchWiFiSSID: true, // met iOS requirements to get SSID. Will leak memory if set to true without meeting requirements.
      useNativeReachability: false,
    });

    const netInfoSubscription = NetInfo.addEventListener(state => {
      if (
        state.isConnected !== null &&
        state.isInternetReachable !== null &&
        (state.isConnected !== true || state.isInternetReachable !== true)
      ) {
        setIsConnected(false);
      } else if (state.isConnected && state.isInternetReachable) {
        setIsConnected(true);
      }
    });

    return () => netInfoSubscription();
  }, []);

  const showNoConnectionAlert = useCallback(() => {
    if (!isConnected) {
      console.log('No connection');
    }
  }, [isConnected]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const data = {
    showNoConnectionAlert,
    isConnected,
  };

  return (
    <NoInternetContext.Provider value={data}>
      {!isConnected && (
        <View style={styles.container}>
          <View style={styles.noInternetContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
              }}>
              <Subtitle
                type={1}
                style={{marginRight: 8}}
                text={i18n.t('You are not connected to the Internet')}
                color={COLORS.shades[0]}
              />
              <Icon name="wifi-off" size={16} color={COLORS.shades[0]} />
            </View>
          </View>
        </View>
      )}
      <View style={{position: 'relative', flex: 1}}>{children}</View>
    </NoInternetContext.Provider>
  );
};

const styles = StyleSheet.create({
  noInternetContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: StatusBarManager.HEIGHT - 6,
    zIndex: 1,
    padding: PADDING.s,
    backgroundColor: COLORS.error[900],
    width: '100%',
  },
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.5),
    zIndex: 1,
  },
});

export const useNoInternetContext = () => {
  const context = useContext(NoInternetContext);

  if (context === null) {
    throw new Error('must be used inside Provider');
  }

  return context;
};

export default InternetCheckProvider;
