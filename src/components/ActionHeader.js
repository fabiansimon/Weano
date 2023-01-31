import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING } from '../constants/Theme';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import ROUTES from '../constants/Routes';

export default function ActionHeader({ style, trip, type }) {
  if (!trip) { return <View />; }
  const navigation = useNavigation();
  const {
    id, title: tripTitle,
  } = trip;

  const isActive = type === 'active';
  const isUpcoming = type === 'upcoming';

  const title = isActive ? i18n.t('Active Trip') : isUpcoming ? i18n.t('Upcoming Trip') : i18n.t('Rewind Trip');
  const backgroundColor = isActive ? COLORS.error[900] : isUpcoming ? COLORS.success[700] : COLORS.primary[700];
  return (
    <Pressable
      onPress={() => navigation.navigate(isActive || isUpcoming ? ROUTES.tripScreen : ROUTES.memoriesScreen, { tripId: id })}
      style={[styles.container, style, { backgroundColor }]}
    >
      <Body
        type={1}
        text={title}
        style={{ fontWeight: '500' }}
        color="white"
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Body
          type={2}
          color="white"
          text={tripTitle}
        />
        <Icon
          name="ios-chevron-forward-circle"
          size={18}
          style={{ marginLeft: 4 }}
          color="white"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: '112%',
    paddingHorizontal: PADDING.l,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary[700],
  },
});
