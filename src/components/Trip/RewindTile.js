import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Foundation';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import COLORS, { RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';
import Headline from '../typography/Headline';
import ROUTES from '../../constants/Routes';

export default function RewindTile({ style, location, tripId }) {
  const navigation = useNavigation();

  const AnimatablePressable = Animatable.createAnimatableComponent(Pressable);

  if (!location) { return <View />; }

  return (
    <AnimatablePressable
      onPress={() => navigation.navigate(ROUTES.memoriesScreen, { tripId })}
      animation="pulse"
      iterationCount={4}
      delay={2000}
      style={[styles.container, style]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name="rewind"
          size={20}
          color={COLORS.shades[0]}
          style={{ marginRight: 8 }}
        />
        <Headline
          type={4}
          text={i18n.t('Rewind time')}
          color={COLORS.shades[0]}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 4, marginLeft: -4 }}>
        <Body
          type={2}
          text={` ${location}`}
          style={{ fontWeight: '500' }}
          color={COLORS.shades[0]}
        />
      </View>
    </AnimatablePressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.primary[700],
    paddingVertical: 10,
  },
});
