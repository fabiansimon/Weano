import {
  Pressable, ScrollView, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';
import ROUTES from '../../constants/Routes';
import Subtitle from '../typography/Subtitle';
import Utils from '../../utils';
import CheckboxTile from './CheckboxTile';
import Avatar from '../Avatar';

export default function ActionTile({ style, trip, type = 'active' }) {
  const navigation = useNavigation();

  const AnimatablePressable = Animatable.createAnimatableComponent(Pressable);

  if (!trip) { return <View />; }
  const {
    id, images, location, dateRange, activeMembers,
  } = trip;

  const isActive = type === 'active';
  const isUpcoming = type === 'upcoming';
  const isRecap = type === 'recap';

  const typeTitle = isActive ? i18n.t('Active') : isUpcoming ? i18n.t('Upcoming') : i18n.t('Rewind');
  const typeColor = isActive ? COLORS.error[900] : isUpcoming ? COLORS.success[700] : COLORS.primary[700];

  const place = location?.placeName.split(',')[0];

  const title = isActive ? `${i18n.t("How's")} ${place} ${i18n.t('treating you?')}`
    : isUpcoming ? `${i18n.t('Ready for')} ${place}?`
      : `${i18n.t('One year ago, you were in')} ${place} ⏳`;

  const subtitle = isActive ? i18n.t('Don’t forget to capture some memories 📸')
    : `${i18n.t('You still have')} ${trip.openTasks.length} ${i18n.t('tasks open ✅')}`;

  const getOpenTaskList = () => {
    const { openTasks } = trip;
    return (
      <ScrollView horizontal style={{ marginHorizontal: -15, paddingHorizontal: 15, marginVertical: 10 }}>
        {openTasks.map((task) => (
          <CheckboxTile
            onPress={() => navigation.navigate(ROUTES.tripScreen, { tripId: id })}
            item={task}
            style={{ marginRight: 20 }}
            userList={activeMembers}
            isDense
          />
        ))}
      </ScrollView>
    );
  };

  const getBottomInfo = () => {
    const { startDate, endDate } = dateRange;

    let timeString = i18n.t('One year ago');
    let difference;
    if (isActive || isUpcoming) {
      const date = isActive ? endDate : startDate;
      const toDate = moment(new Date(date * 1000));
      const fromDate = moment().startOf('day');
      difference = Math.round(moment.duration(toDate.diff(fromDate)).asDays()) - 1;
      timeString = !isActive ? `${i18n.t('in')} ${difference} ${difference === 1 ? i18n.t('day') : i18n.t('days')}` : `${difference} ${i18n.t('days left')}`;
    }

    let progress = 100;
    if (isActive) {
      const total = Math.abs(((startDate / 86400) - (endDate / 86400)).toFixed(0));
      progress = ((total - difference) / total) * 100;
    }

    if (isUpcoming) {
      progress = ((7 - difference) / 7) * 100;
    }

    return (
      <View style={{ marginTop: isActive && 14 }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'flex-end',
        }}
        >
          <View style={{ flexDirection: 'row', marginLeft: 6 }}>
            {activeMembers.map((user) => (
              <Avatar
                size={20}
                style={{ marginLeft: -6 }}
                data={user}
              />
            ))}
            {isActive && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
              <Icon
                name="photograph"
                color={COLORS.neutral[300]}
                size={14}
              />
              <Body
                type={1}
                text={images.length}
                style={{ marginLeft: 2 }}
                color={COLORS.neutral[300]}
              />
            </View>
            )}
          </View>
          <Subtitle
            type={1}
            text={timeString}
            color={typeColor}
          />
        </View>
        <View>
          <View style={{
            height: 7, backgroundColor: Utils.addAlpha(typeColor, 0.15), borderRadius: 10, marginTop: 5,
          }}
          />
          <View style={{
            position: 'absolute',
            height: 7,
            width: `${progress}%`,
            backgroundColor: typeColor,
            borderRadius: 10,
            marginTop: 5,
          }}
          />
        </View>
      </View>
    );
  };

  return (
    <AnimatablePressable
      onPress={() => navigation.navigate(isActive || isUpcoming ? ROUTES.tripScreen : ROUTES.memoriesScreen, { tripId: id })}
      animation="pulse"
      iterationCount={4}
      delay={2000}
      style={[styles.container, style, { shadowColor: COLORS.neutral[300] }]}
    >
      <View style={[styles.typeContainer, { backgroundColor: Utils.addAlpha(typeColor, 0.2) }]}>
        <Subtitle
          type={1}
          text={typeTitle}
          color={typeColor}
        />
      </View>
      <View>
        <Body
          type={1}
          style={{ marginTop: -4, maxWidth: '70%' }}
          text={title}
          color={COLORS.shades[100]}
        />
        <Body
          type={2}
          text={!isRecap && subtitle}
          style={{ marginTop: 2, maxWidth: '60%' }}
          color={COLORS.neutral[300]}
        />
      </View>
      {isUpcoming && getOpenTaskList()}
      {getBottomInfo()}
    </AnimatablePressable>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      height: 4,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    borderRadius: RADIUS.m,
    padding: PADDING.m,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],

  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
