import {
  StyleSheet,
  Dimensions,
  View,
  Pressable,
  Platform,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Logo from '../../../assets/images/logo_inverted.png';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';
import TitleModal from '../TitleModal';
import Clipboard from '@react-native-clipboard/clipboard';

export default function ShareModal({isVisible, onRequestClose, value}) {
  const {width} = Dimensions.get('window');

  const handleShare = () => {
    Share.share({
      message: `Hey! You've been invited to join a trip! Click the link below to join! ${value}`,
    });
  };

  const copyLink = () => {
    Clipboard.setString(`${value}`);
    Toast.show({
      type: 'success',
      text1: i18n.t('Copied!'),
      text2: i18n.t('You can now send it to your friends'),
    });
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Share Trip')}>
      <View style={styles.container}>
        <Body
          type={2}
          color={COLORS.neutral[500]}
          text={i18n.t(
            'Your friends can either join by scanning the code via their camera app or within the app.',
          )}
        />
        <View style={{alignItems: 'center', marginTop: 30}}>
          <QRCode
            value={value}
            logo={Logo}
            size={width * 0.6}
            color={COLORS.shades[100]}
            logoBackgroundColor={COLORS.shades[0]}
            logoBorderRadius={10}
            logoMargin={1}
          />
          <Pressable
            onPress={copyLink}
            style={[styles.shareButton, {marginTop: 30}]}>
            <Body
              text={i18n.t('Copy link')}
              color={COLORS.neutral[700]}
              style={{
                textAlign: 'left',
                fontWeight: Platform.OS === 'android' ? '600' : '500',
              }}
            />
            <Icon
              style={{marginLeft: 8}}
              name="content-copy"
              color={COLORS.neutral[700]}
              size={18}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={[styles.shareButton, {marginTop: 10}]}>
            <Body
              color={COLORS.neutral[700]}
              style={{
                textAlign: 'left',
                fontWeight: Platform.OS === 'android' ? '600' : '500',
              }}
              text={i18n.t('Share invitation')}
            />
            <Icon
              style={{marginLeft: 8}}
              name="ios-share"
              color={COLORS.neutral[700]}
              size={18}
            />
          </Pressable>
        </View>
      </View>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: PADDING.m,
    paddingHorizontal: PADDING.m,
    backgroundColor: COLORS.shades[0],
    flex: 1,
  },
  shareButton: {
    width: '65%',
    flexDirection: 'row',
    paddingHorizontal: 14,
    minHeight: 45,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLORS.neutral[100],
  },
});
