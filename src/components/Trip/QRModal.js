import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Logo from '../../../assets/images/logo_blue.png';
import Utils from '../../utils';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';

export default function QRModal({isVisible, onRequestClose, value}) {
  // STATE & MISC
  const [showModal, setShowModal] = useState(isVisible);
  const animatedScale = useRef(new Animated.Value(0)).current;

  const duration = 350;
  const width = Dimensions.get('window').width * 0.5;

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

  const toggleModal = () => {
    if (isVisible) {
      setShowModal(true);
      Animated.spring(animatedScale, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        setShowModal(false);
      }, duration - 100);
      Animated.spring(animatedScale, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal
      animationType="fade"
      visible={showModal}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onRequestClose}
        style={styles.container}>
        <Animated.View
          style={[
            styles.innerContainer,
            {transform: [{scale: animatedScale}]},
          ]}>
          <QRCode
            value={value}
            logo={Logo}
            size={width}
            color={COLORS.shades[0]}
            enableLinearGradient
            linearGradient={[COLORS.primary[300], COLORS.primary[900]]}
            logoBackgroundColor={COLORS.shades[0]}
            logoBorderRadius={100}
            logoMargin={2}
          />
          <Body
            style={{
              maxWidth: width + 10,
              marginTop: 10,
            }}
            type={2}
            color={COLORS.neutral[900]}
            text={i18n.t('Scan this QR code to join 🎉')}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  avatar: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: PADDING.m,
    paddingVertical: PADDING.l,
    paddingBottom: 10,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.l,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  splitContainer: {
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  avatarOverlay: {
    position: 'absolute',
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.5),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    flex: 1,
  },
});
