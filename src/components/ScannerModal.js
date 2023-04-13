import {StyleSheet, Dimensions, View} from 'react-native';
import React from 'react';
import i18n from '../utils/i18n';
import TitleModal from './TitleModal';
import COLORS, {RADIUS} from '../constants/Theme';
import {Camera} from 'expo-camera';
import QrCodeOverlay from '../../assets/icons/qrCode.svg';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../constants/Routes';

export default function ScannerModal({isVisible, onRequestClose, value}) {
  const navigation = useNavigation();

  const handleScan = ({data}) => {
    const url = data.split('/');
    setTimeout(() => {
      navigation.navigate(ROUTES.invitationScreen, {
        tripId: url[url.length - 1],
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
        <Camera onBarCodeScanned={handleScan} style={{flex: 1}} />
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
