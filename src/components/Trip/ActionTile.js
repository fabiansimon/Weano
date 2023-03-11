import {
  Animated,
  Pressable, ScrollView, StyleSheet, View,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import EntIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Fontisto';
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

export default function ActionTile({ style, trip }) {
  // STATE & MISC
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(50)).current;
  const animatedBorderRadius = useRef(new Animated.Value(RADIUS.xl)).current;

  const duration = 300;
  const noTasks = !(trip?.openTasks && trip?.openTasks.length > 0);

  const isActive = trip?.type === 'active';
  const isUpcoming = trip?.type === 'upcoming' || trip?.type === 'soon';
  const isRecap = trip?.type === 'recap';
  const height = isActive ? 150 : isUpcoming && noTasks ? 130 : isUpcoming && !noTasks ? 180 : 130;

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  useEffect(() => {
    if (isExpanded) {
      Animated.spring(animatedHeight, {
        toValue: height,
        duration,
        bounciness: 0.2,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedBorderRadius, {
        toValue: RADIUS.m,
        bounciness: 0.2,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animatedHeight, {
        toValue: 50,
        bounciness: 0.2,
        duration,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedBorderRadius, {
        toValue: 30,
        bounciness: 0.2,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded]);

  const navigation = useNavigation();

  if (!trip) { return <View />; }
  const {
    id, images, location, dateRange, activeMembers, title: tripTitle,
  } = trip;

  const typeTitle = isActive ? i18n.t('Active') : isUpcoming ? i18n.t('Upcoming') : i18n.t('Rewind');
  const typeColor = isActive ? COLORS.error[900] : isUpcoming ? COLORS.success[700] : COLORS.primary[700];

  const place = location?.placeName.split(',')[0];

  const title = isActive ? `${i18n.t("How's")} ${place} ${i18n.t('treating you?')}`
    : isUpcoming ? `${i18n.t('Ready for')} ${place}?`
      : `${i18n.t('One year ago, you were in')} ${place} ⏳`;

  const getSubtitle = () => {
    if (isActive) {
      return i18n.t('Don’t forget to capture some memories 📸');
    }

    if (isUpcoming) {
      if (!noTasks) {
        return `${i18n.t('You still have')} ${trip.openTasks?.length} ${i18n.t('tasks open ✅')}`;
      }
      return i18n.t('You have no tasks open ✅');
    }
  };
  const subtitle = getSubtitle();

  const getOpenTaskList = () => {
    const { openTasks } = trip;
    return (
      <ScrollView horizontal style={{ marginHorizontal: -PADDING.s, paddingHorizontal: 15, marginVertical: 10 }}>
        {openTasks?.map((task) => (
          <CheckboxTile
            key={task.id}
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
      difference = Utils.getDaysDifference(toDate / 1000);
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
      <View style={{ marginTop: isActive ? 14 : 1 }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'flex-end',
        }}
        >
          <View style={{ flexDirection: 'row', marginLeft: 6 }}>
            {activeMembers.map((user) => (
              <Avatar
                key={user.id}
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
                text={images?.length || 0}
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

  const getMinimizedTitle = () => (
    <View style={{ marginLeft: 2, flexDirection: 'row' }}>
      <Body
        style={{ fontWeight: '500' }}
        type={1}
        text={tripTitle}
      />
      {tripTitle?.length < 18 && (
      <Body
        style={{ fontWeight: '400' }}
        type={1}
        color={COLORS.neutral[300]}
        numberOfLines={1}
        ellipsizeMode="tail"
        text={`, ${location?.placeName.split(',')[0]}`}
      />
      )}
    </View>
  );

  return (
    <AnimatedPressable
      onPress={() => navigation.navigate(isActive || isUpcoming ? ROUTES.tripScreen : ROUTES.memoriesScreen, { tripId: id })}
      style={[styles.container, style, { shadowColor: COLORS.neutral[300] }, { height: animatedHeight, borderRadius: animatedBorderRadius }]}
    >
      <View>
        <View
          style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', flex: 1, marginRight: 28 }}>
            <Pressable
              hitSlop={40}
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <EntIcon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.neutral[300]}
                style={{ marginRight: 4 }}
              />
            </Pressable>
            {isExpanded ? (
              <Body
                type={1}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ maxWidth: '100%', fontWeight: '500' }}
                text={title}
                color={COLORS.shades[100]}
              />
            ) : getMinimizedTitle()}
          </View>
          <View style={[styles.typeContainer, { backgroundColor: Utils.addAlpha(typeColor, 0.2) }]}>
            <Subtitle
              type={1}
              text={typeTitle}
              color={typeColor}
            />
          </View>
        </View>

        {isExpanded && (
        <Body
          type={1}
          text={!isRecap && subtitle}
          style={{ maxWidth: '80%' }}
          color={COLORS.neutral[300]}
        />
        )}
      </View>
      {isUpcoming && getOpenTaskList()}
      {getBottomInfo()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      height: 4,
    },
    overflow: 'hidden',
    shadowRadius: 10,
    shadowOpacity: 0.1,
    borderRadius: RADIUS.m,
    padding: PADDING.s,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],

  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
