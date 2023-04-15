import {StyleSheet, Dimensions, View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import i18n from '../utils/i18n';
import TitleModal from './TitleModal';
import COLORS, {RADIUS} from '../constants/Theme';
import {Camera} from 'expo-camera';
import QrCodeOverlay from '../../assets/icons/qrCode.svg';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../constants/Routes';
import META_DATA from '../constants/MetaData';

export default function ScannerModal({isVisible, onRequestClose, trips}) {
  const navigation = useNavigation();
  const [isScanned, setIsScanned] = useState(false);

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
      navigation.navigate(ROUTES.invitationScreen, {
        tripId,
      });
    }, 300);

    onRequestClose();
  };
  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Scan QR Code')}>
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
});
