import {
  Pressable,
  ScrollView, StyleSheet, View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/Theme';
import Body from './typography/Body';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import Label from './typography/Label';
import Headline from './typography/Headline';
import TripContainer from './Trip/TripContainer';

export default function StorySection({
  style, contentContainerStyle, data, onLongPress,
}) {
  const navigation = useNavigation();

  return (
    <View style={style}>
      <ScrollView
        horizontal
        contentContainerStyle={contentContainerStyle}
      >
        <Pressable
          onPress={() => navigation.navigate(ROUTES.mapScreen)}
          style={{ marginRight: 14 }}
        >
          <View style={styles.mapButton}>
            <Headline type={1} text="🌍" />
          </View>
          <Body
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginTop: 6, marginBottom: -2, textAlign: 'center' }}
            type={2}
            text={i18n.t('See Map')}
          />
          <Label
            style={{ textAlign: 'center' }}
            type={1}
            color={COLORS.neutral[300]}
            text={`${data.length} ${i18n.t('Trips')}`}
          />
        </Pressable>
        {data.map((trip) => {
          const { type } = trip;
          if (type === 'upcoming' || type === 'soon') {
            return;
          }
          return (
            <TripContainer
              key={trip.id}
              disabled={false}
              onPress={() => navigation.navigate(ROUTES.memoriesScreen, { tripId: trip.id, initShowStory: true })}
              onLongPress={onLongPress}
              trip={trip}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapButton: {
    height: 68,
    width: 68,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
