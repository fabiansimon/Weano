import {
  View, StyleSheet, SectionList, Dimensions, Image, Pressable,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useQuery } from '@apollo/client';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import i18n from '../utils/i18n';
import HybridHeader from '../components/HybridHeader';
import INFORMATION from '../constants/Information';
import activeTripStore from '../stores/ActiveTripStore';
import GET_TRIP_BY_ID from '../queries/getTripById';
import Utils from '../utils';
import Headline from '../components/typography/Headline';
import Body from '../components/typography/Body';

export default function TimelineScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { id: tripId } = activeTripStore((state) => state.activeTrip);
  const [timelineData, setTimelineData] = useState([]);
  const { error, data } = useQuery(GET_TRIP_BY_ID, {
    variables: {
      tripId,
    },
  });

  const { height } = Dimensions.get('window');

  const months = [
    i18n.t('Januray'),
    i18n.t('February'),
    i18n.t('March'),
    i18n.t('April'),
    i18n.t('May'),
    i18n.t('June'),
    i18n.t('July'),
    i18n.t('August'),
    i18n.t('September'),
    i18n.t('October'),
    i18n.t('November'),
    i18n.t('December'),
  ];

  const setData = (d) => {
    const { expenses, images } = d;
    const generalArr = [...expenses, ...images];
    generalArr.sort((a, b) => a.createdAt - b.createdAt);

    setTimelineData(sortArr(generalArr));
  };

  const sortArr = (arr) => {
    const dataSet = [];

    for (let i = 0; i < arr.length; i += 1) {
      // const month = moment(arr[i].start_time).format('MMYY');
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
      }, 500);
    }
  }, [error, data]);

  const getItem = (item) => {
    // eslint-disable-next-line no-underscore-dangle
    const isImage = item.__typename === 'Image';
    const title = isImage ? `${i18n.t('Uploaded photo 📸')}` : `${i18n.t('Added expense 💰')}`;

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
        <Pressable style={styles.tile}>
          {isImage ? (
            <Image
              style={{
                height: 45, width: 36, borderRadius: 4, marginRight: 10,
              }}
              source={{ uri: item.uri }}
            />
          ) : (
            <View style={{
              marginRight: 10, justifyContent: 'center', maxWidth: 110,
            }}
            >
              <Headline
                type={3}
                text={`${item.amount}${item.currency}`}
                // color={COLORS.warning[500]}
              />
              <Body
                type={2}
                text={item.title}
                color={COLORS.neutral[300]}
              />
            </View>
          )}
          <View style={{
            justifyContent: 'space-between', flex: 1,
          }}
          >
            <Body
              style={{ textAlign: 'right' }}
              type={1}
              isDense
              color={COLORS.shades[100]}
              text={title}
            />
            <Body
              type={2}
              style={{ textAlign: 'right' }}
              color={COLORS.neutral[300]}
              text={Utils.getDateFromTimestamp(item.createdAt / 1000, 'MMM DD YYYY • HH:mm')}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Timeline Recap 🔙')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <SectionList
            style={{ marginHorizontal: 10 }}
            stickySectionHeadersEnabled
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
                <Headline
                  type={3}
                  style={{ alignSelf: 'center' }}
                  color={COLORS.neutral[700]}
                  text={i18n.t('No recent reservations yet')}
                />
              </View>
              )}
            contentContainerStyle={{ paddingBottom: 150 }}
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
    paddingTop: 15,
    paddingBottom: 36,
  },
  tile: {
    marginVertical: 10,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    padding: 10,
    backgroundColor: COLORS.shades[0],
    minHeight: 68,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
