import {
  Image, Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Headline from '../typography/Headline';
import Subtitle from '../typography/Subtitle';
import Calendar3D from '../../../assets/images/calendar_3d.png';
import Location3D from '../../../assets/images/location_3d.png';
import i18n from '../../utils/i18n';

export default function SetupContainer({
  style, onPress, type = 'location',
}) {
  const source = type === 'location' ? Location3D : Calendar3D;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={{ justifyContent: 'space-between' }}>
        <Headline
          type={3}
          isDense
          text={i18n.t('Set destination')}
          color={COLORS.shades[0]}
        />
        <Subtitle
          style={{ marginTop: 2 }}
          type={2}
          text={i18n.t('You can always change it later')}
          color={COLORS.shades[0]}
        />
      </View>
      <Image
        source={source}
        resizeMode="cover"
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.m,
    height: 86,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.primary[700],
    borderWidth: 2,
    borderColor: COLORS.shades[0],
    shadowColor: COLORS.neutral[700],
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      x: 0,
      y: 0,
    },
  },
  image: {
    height: 60,
    width: 60,
  },
});
