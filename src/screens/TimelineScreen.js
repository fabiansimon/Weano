/* eslint-disable react/jsx-closing-tag-location */
import {
  View, StyleSheet, SectionList, Dimensions, StatusBar,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useQuery } from '@apollo/client';
import FastImage from 'react-native-fast-image';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import i18n from '../utils/i18n';
import HybridHeader from '../components/HybridHeader';
import INFORMATION from '../constants/Information';
import activeTripStore from '../stores/ActiveTripStore';
import Utils from '../utils';
import Headline from '../components/typography/Headline';
import Body from '../components/typography/Body';
import GET_TIMELINE_DATA from '../queries/getTimelineData';
import TimelineSkeleton from '../components/Trip/TimelineSkeleton';
import userManagement from '../utils/userManagement';
import months from '../constants/Months';

export default function TimelineScreen() {
  // STORES
  const { id: tripId } = activeTripStore((state) => state.activeTrip);

  // QUERIES
  const { error, data, loading } = useQuery(GET_TIMELINE_DATA, {
    variables: {
      tripId,
    },
    fetchPolicy: 'network-only',
  });

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [timelineData, setTimelineData] = useState([]);

  const { height } = Dimensions.get('window');

  const setData = (d) => {
    const {
      expenses, images, mutualTasks, polls,
    } = d;
    const expenseData = expenses || [];
    const imageData = images || [];
    const generalArr = [...expenseData, ...imageData, ...mutualTasks, ...polls];
    generalArr.sort((a, b) => a.createdAt - b.createdAt);

    setTimelineData(sortArr(generalArr));
  };

  const sortArr = (arr) => {
    const dataSet = [];

    for (let i = 0; i < arr.length; i += 1) {
      const datestamp = Utils.getDateFromTimestamp(arr[i].createdAt / 1000, 'DDMMYY');
      const setSection = getMonthString(datestamp);

      const index = dataSet.findIndex((d) => d.title === setSection);

      if (index < 0) {
        dataSet.push({
          title: setSection,
          data: [arr[i]],
        });
      } else {
        dataSet[index].data.push(arr[i]);
      }
    }
    return dataSet;
  };

  const getMonthString = (month) => {
    const day = month.slice(0, 2);
    let mm;
    if (month[2] === '0') {
      mm = month.slice(3, 4);
    } else {
      mm = month.slice(2, 4);
    }

    return `${day} ${months[mm - 1]} 20${month.slice(3, 5)}`;
  };

  useEffect(() => {
    if (data) {
      setData(data.getTripById);
    }

    if (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error.message,
        });
        console.log(error.message);
      }, 500);
    }
  }, [error, data]);

  const getData = (item) => {
    const createdBy = item.author || item.creatorId;
    const { firstName } = userManagement.convertIdToUser(createdBy);
    const { __typename: type } = item;

    switch (type) {
      case 'Image':
        return {
          title: `${firstName || i18n.t('Deleted user')} ${i18n.t('uploaded photo')}`,
          leading: <FastImage
            style={{
              height: 45, width: 36, borderRadius: 4, marginRight: 10,
            }}
            source={{ uri: item.uri }}
          />,
          dateStamp: Utils.getDateFromTimestamp(item.createdAt / 1000, 'MMM DD YYYY • HH:mm'),
        };
      case 'Expense':
        return {
          title: `${firstName || i18n.t('Deleted user')} ${i18n.t('added an expense')}`,
          leading: <View style={{
            marginRight: 10, justifyContent: 'center', maxWidth: 110,
          }}
          >
            <Headline
              type={4}
              text={`${item.amount}${item.currency}`}
            />
            <Body
              type={2}
              text={item.title}
              color={COLORS.neutral[300]}
            />
          </View>,
          dateStamp: Utils.getDateFromTimestamp(item.createdAt / 1000, 'MMM DD YYYY • HH:mm'),
        };
      case 'Poll':
        return {
          title: `${firstName || i18n.t('Deleted user')} ${i18n.t('created a poll')}`,
          leading: <View style={{
            marginRight: 10, justifyContent: 'center', maxWidth: 110,
          }}
          >
            <Body
              type={2}
              text={i18n.t('Poll')}
              color={COLORS.neutral[300]}
            />
            <Headline
              type={4}
              text={item.title}
            />
          </View>,
          dateStamp: Utils.getDateFromTimestamp(item.createdAt / 1000, 'MMM DD YYYY • HH:mm'),
        };
      case 'Task':
        return {
          title: `${firstName || i18n.t('Deleted user')} ${i18n.t('created a task')}`,
          leading: <View style={{
            marginRight: 10, justifyContent: 'center', maxWidth: 110,
          }}
          >
            <Body
              type={2}
              text={i18n.t('Task')}
              color={COLORS.neutral[300]}
            />
            <Body
              type={1}
              text={item.title}
            />
          </View>,
          dateStamp: Utils.getDateFromTimestamp(item.createdAt / 1000, 'MMM DD YYYY • HH:mm'),
        };
      default:
        return {
          title: '',
          leading: <View />,
          dateStamp: '',
        };
    }
  };

  const getItem = (item) => {
    const itemData = getData(item);

    return (
      <View style={{
        flexDirection: 'row', alignItems: 'center', width: '100%',
      }}
      >
        <View style={{
          borderLeftColor: COLORS.neutral[100],
          borderLeftWidth: 1,
          height: '100%',
        }}
        />
        <View style={{
          borderTopColor: COLORS.neutral[100],
          borderTopWidth: 1,
          width: 20,
        }}
        />
        <View
          style={styles.tile}
        >
          {itemData.leading}
          <View style={{
            justifyContent: 'center', flex: 1,
          }}
          >
            <Body
              style={{ textAlign: 'right' }}
              type={1}
              color={COLORS.neutral[700]}
              text={itemData.title}
            />
            <Body
              type={2}
              style={{ textAlign: 'right' }}
              color={COLORS.neutral[300]}
              text={itemData.dateStamp}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HybridHeader
        title={i18n.t('Timeline Recap')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
        scrollEnabled
      >
        <View style={styles.innerContainer}>
          {loading ? <TimelineSkeleton /> : (
            <SectionList
              style={{ marginHorizontal: 10 }}
              stickySectionHeadersEnabled
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              sections={timelineData}
              ListEmptyComponent={(
                <View
                  style={{
                    flex: 1,
                    height: height * 0.65,
                    justifyContent: 'center',
                  }}
                >
                  <Body
                    type={1}
                    style={{ alignSelf: 'center' }}
                    color={COLORS.shades[100]}
                    text={i18n.t('There are no entries yet 😕')}
                  />
                  <Body
                    type={2}
                    style={{
                      alignSelf: 'center', textAlign: 'center', width: '85%', marginTop: 4,
                    }}
                    color={COLORS.neutral[300]}
                    text={i18n.t('When the groups adds new polls, tasks, expenses or memories, they will be listed here.')}
                  />
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 80 }}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => getItem(item)}
              renderSectionHeader={({ section: { title } }) => (
                <Body
                  type={1}
                  color={COLORS.neutral[300]}
                  text={title}
                  style={{ marginVertical: 10 }}
                />
              )}
            />
          )}
        </View>
      </HybridHeader>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  innerContainer: {
    paddingHorizontal: PADDING.s,
    paddingBottom: 36,
    flex: 1,
  },
  tile: {
    marginVertical: 10,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    padding: 10,
    backgroundColor: COLORS.shades[0],
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
