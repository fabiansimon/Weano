import {StyleSheet, View, Alert, Linking, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import i18n from '../utils/i18n';
import {Camera} from 'expo-camera';
import TitleModal from './TitleModal';
import COLORS, {PADDING} from '../constants/Theme';
import QrCodeOverlay from '../../assets/icons/qrCode.svg';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../constants/Routes';
import META_DATA from '../constants/MetaData';
import Button from './Button';
import Body from './typography/Body';
import Headline from './typography/Headline';

export default function ScannerModal({isVisible, onRequestClose, trips}) {
  const navigation = useNavigation();
  const [isScanned, setIsScanned] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    setIsScanned(false);
  }, [isVisible]);

  const handleScan = ({data}) => {
    setIsScanned(true);
    if (!data.includes(META_DATA.baseUrl)) {
      return Alert.alert(
        i18n.t('Not a valid trip'),
        i18n.t('Try a different QR Code'),
        [{text: 'OK', onPress: () => setIsScanned(false)}],
      );
    }
    const url = data.split('/');
    const tripId = url[url.length - 1];

    if (trips.findIndex(trip => trip.id === tripId) !== -1) {
      return Alert.alert(
        i18n.t('Whops, it seems like you already joined this trip'),
        i18n.t('Try a different trip'),
        [{text: 'OK', onPress: () => setIsScanned(false)}],
      );
    }

    setTimeout(() => {
      navigation.push(ROUTES.invitationScreen, {
        tripId,
        fromDeeplink: false,
      });
    }, 300);

    onRequestClose();
  };

  if (!permission) {
    return;
  }

  const getNoPermissionContainer = () => {
    return (
      <View style={styles.noPermission}>
        <View>
          <Headline
            type={4}
            style={{marginRight: PADDING.xl}}
            color={COLORS.shades[100]}
            text={i18n.t('Please allow us to access your camera')}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            style={{marginTop: 6, marginRight: 40}}
            text="Without it you won't be able to join your friends trip"
          />
        </View>
        <View style={{width: '100%', flex: 1}}>
          <Button
            style={{width: '100%', marginTop: 'auto'}}
            fullWidth
            onPress={requestPermission}
            text={i18n.t('Grant permission')}
          />
          <Button
            isSecondary
            style={{width: '100%', marginTop: 8}}
            fullWidth
            onPress={() => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:Bluetooth');
              } else {
                Linking.openSettings();
              }
            }}
            text={i18n.t('Open in Settings')}
          />
        </View>
      </View>
    );
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Scan QR Code')}>
      {!permission.granted ? (
        getNoPermissionContainer()
      ) : (
        <View style={styles.container}>
          <Camera
            onBarCodeScanned={!isScanned ? handleScan : undefined}
            ratio="16:9"
            style={{flex: 1}}
          />
          <View style={styles.overlay}>
            <QrCodeOverlay fill={COLORS.shades[0]} />
          </View>
        </View>
      )}
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.shades[0],
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    height: '83%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPermission: {
    marginBottom: Platform.OS === 'android' ? 0 : 10,
    flex: 1,
    paddingVertical: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.l,
    backgroundColor: COLORS.shades[0],
  },
});
