import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import Toast from 'react-native-toast-message';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import COLORS, { RADIUS } from '../constants/Theme';
import Body from './typography/Body';
import Utils from '../utils';
import InstagramBubble from '../../assets/images/instagram_bubble.png';
import Button from './Button';
import toastConfig from '../constants/ToastConfig';

export default function ImageSharedModal({
  image, style, onDone,
}) {
  const facebookColor = '#4267B2';
  const whatsappColor = '#25D366';

  const ShareContainer = () => (
    <View style={styles.shareContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.roundButton}
        onPress={() => Utils.downloadImage(image)}
      >
        <Icon
          name="ios-download"
          size={22}
          color={Utils.addAlpha(COLORS.neutral[50], 0.9)}
          style={{ marginTop: -2, marginRight: -2 }}
        />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.9}>
        <Image
          source={InstagramBubble}
          style={{ height: 50, width: 50, marginLeft: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.roundButton, { backgroundColor: whatsappColor, marginLeft: 10 }]}
      >
        <Icon
          name="ios-logo-whatsapp"
          size={22}
          color={COLORS.shades[0]}
          style={{ marginTop: -2, marginRight: -2 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.roundButton, { backgroundColor: facebookColor, marginLeft: 10 }]}
      >
        <FIcon
          name="facebook-f"
          size={22}
          color={COLORS.shades[0]}
          style={{ marginLeft: -1 }}
        />
      </TouchableOpacity>
    </View>
  );

  return (

    <View style={[styles.container, style]}>
      <View style={{ flexDirection: 'row' }}>
        <Headline
          type={2}
          text={i18n.t('What a')}
          color={COLORS.shades[0]}
        />
        <View style={styles.memoryContainer}>
          <Headline
            type={2}
            isDense
            text={i18n.t('memory,')}
            style={{ transform: [{ skewX: '+8deg' }] }}
            color={COLORS.shades[0]}
          />
        </View>
        <Headline
          type={2}
          text={i18n.t('huh?')}
          color={COLORS.shades[0]}
        />
      </View>
      <Body
        type={1}
        text={i18n.t('You should share it')}
        style={{ marginTop: 6 }}
        color={COLORS.neutral[300]}
      />
      <Image
        source={{ uri: image && image.uri }}
        style={styles.image}
      />
      <View>
        <ShareContainer />
        <Button
          text={i18n.t('Done')}
          backgroundColor={COLORS.shades[0]}
          textColor={COLORS.shades[100]}
          onPress={onDone}
          style={{ marginTop: 20, borderRadius: RADIUS.xl }}
        />
      </View>
      <Toast config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryContainer: {
    alignSelf: 'center',
    height: 30,
    marginHorizontal: 6,
    borderRadius: 2,
    transform: [{ skewX: '-8deg' }],
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  shareContainer: {
    marginTop: 10,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 32,
    backgroundColor: COLORS.neutral[900],
  },
  roundButton: {
    height: 50,
    width: 50,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 3 / 4,
    height: '40%',
    marginVertical: 30,
    borderRadius: RADIUS.s,
    transform: [{ rotate: '2deg' }],
    shadowColor: COLORS.shades[100],
    shadowRadius: 100,
    shadowOpacity: 1,
  },
});
