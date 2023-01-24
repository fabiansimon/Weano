import {
  Pressable, ScrollView, StyleSheet, View,
} from 'react-native';
import React, { useRef } from 'react';
import Icon from 'react-native-vector-icons/Foundation';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';
import Headline from '../typography/Headline';
import ROUTES from '../../constants/Routes';
import Subtitle from '../typography/Subtitle';
import Utils from '../../utils';

export default function ActionTile({ style, trip, isActive }) {
  const navigation = useNavigation();
  const scrollRef = useRef();

  const AnimatablePressable = Animatable.createAnimatableComponent(Pressable);

  if (!trip) { return <View />; }
  const {
    id, images, location, dateRange, expensesTotal,
  } = trip;

  const tripStats = [
    {
      string: i18n.t('days total'),
      value: ((dateRange.endDate - (dateRange.startDate)) / (3600 * 24)).toFixed(0),
      isHidden: isActive,
    },
    {
      string: i18n.t('days left'),
      value: ((dateRange.endDate - (new Date() / 1000).toFixed(0)) / (3600 * 24)).toFixed(0),
      isHidden: !isActive,
    },
    {
      string: i18n.t('memories'),
      value: images.length,
    },
    {
      string: i18n.t('spent'),
      value: `$${expensesTotal}`,
      isHidden: !expensesTotal,
    },
  ];
  return (
    <AnimatablePressable
      onPress={() => navigation.navigate(isActive ? ROUTES.tripScreen : ROUTES.memoriesScreen, { tripId: id })}
      animation="pulse"
      iterationCount={4}
      delay={2000}
      style={[styles.container, style, { backgroundColor: isActive ? COLORS.error[700] : COLORS.primary[700] }]}
    >
      <View style={styles.typeContainer}>
        {isActive ? (
          <View style={{
            height: 8, width: 8, borderRadius: RADIUS.xl, backgroundColor: COLORS.shades[0], marginRight: 8,
          }}
          />
        ) : (
          <Icon
            name="rewind"
            size={18}
            color={COLORS.shades[0]}
            style={{ marginRight: 8 }}
          />
        )}
        <Body
          type={2}
          text={isActive ? i18n.t('Live Trip') : i18n.t('Rewind')}
          color={COLORS.shades[0]}
        />
      </View>
      <View>
        <Body
          type={2}
          text={`${i18n.t("How's")} ${location.placeName} ${i18n.t('treating you?')}`}
          color={COLORS.shades[0]}
        />
        <Subtitle
          type={2}
          text={i18n.t("Don't forget to capture some memories!")}
          style={{ marginTop: 2, maxWidth: '50%' }}
          color={Utils.addAlpha(COLORS.neutral[50], 0.6)}
        />
      </View>
      <ScrollView
        ref={scrollRef}
        style={{ marginHorizontal: -PADDING.s, paddingHorizontal: PADDING.s, marginBottom: 4 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tripStats.map((stat) => {
          if (!stat.isHidden) {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginRight: 10 }}>
                <Headline
                  type={2}
                  color={COLORS.shades[0]}
                  text={stat.value}
                  isDense
                />
                <Subtitle
                  type={1}
                  color={COLORS.shades[0]}
                  text={stat.string}
                  style={{ marginBottom: 2, marginLeft: 2 }}
                />
              </View>
            );
          }
          return null;
        })}
      </ScrollView>
    </AnimatablePressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.s,
    height: 116,
    padding: PADDING.s,
    borderWidth: 1,
    borderColor: COLORS.error[900],
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    position: 'absolute',
    top: 10,
    backgroundColor: COLORS.error[900],
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
