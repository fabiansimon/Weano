import {
  Image, Pressable, StyleSheet, View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import EntIcon from 'react-native-vector-icons/Entypo';
import ActivityChip from '../ActivityChip';
import i18n from '../../utils/i18n';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Body from '../typography/Body';
import Headline from '../typography/Headline';
import AirbnbLogo from '../../../assets/images/airbnb.png';
import BookinLogo from '../../../assets/images/booking.png';
import HostelworldLogo from '../../../assets/images/hostelworld.png';
import Utils from '../../utils';
import WebViewModal from '../WebViewModal';

export default function AffiliateInfoView({
  info, destinations, dateRange, amountPeople,
}) {
  // STATE & MISC
  const [nightsCounter, setNightsCounter] = useState(0);
  const [dates, setDates] = useState({
    start: 0,
    end: 0,
  });
  const [webInfo, setWebInfo] = useState({
    title: 'Hostelworld',
    url: 'www.google.com',
    isVisible: false,
  });

  const ONE_DAY = 86400;

  const { startDate, endDate } = dateRange;

  useEffect(() => {
    const newEnd = dates.start + (nightsCounter * ONE_DAY);

    setDates((prev) => ({
      start: prev.start,
      end: newEnd,
    }));
  }, [nightsCounter]);

  useEffect(() => {
    if (!info) {
      return;
    }

    if (destinations.length <= 1) {
      return setDates({
        start: startDate,
        end: endDate,
      });
    }

    const diff = Utils.getDaysDifference(dateRange.startDate, dateRange.endDate, true);
    const split = parseInt((diff / destinations.length).toFixed(0), 10);
    setNightsCounter(split);

    const newStart = startDate + (ONE_DAY * (split * info.index));
    const newEnd = newStart + (ONE_DAY * split);
    setDates({
      start: newStart,
      end: newEnd,
    });
  }, [destinations]);

  if (!info) {
    return <View />;
  }

  const { index, link } = info;
  const isSleep = link.type === 'sleep';
  const isTransport = link.type === 'transport';
  const isDiscover = link.type === 'discover';
  const isFood = link.type === 'food';

  const title = isSleep ? i18n.t('Sleep in') : isTransport ? i18n.t('Getting from') : isDiscover ? i18n.t('What to do in') : i18n.t('Where to eat in');
  const findTitle = isSleep ? i18n.t('Find accomodation') : isTransport ? i18n.t('Find transportation') : isDiscover ? i18n.t('Find activites') : i18n.t('Find where to eat');
  const placeHolder = isSleep ? i18n.t('From') : i18n.t('On the');

  const affData = [
    {
      title: 'Hostelworld',
      type: 'hostelworld',
      url: 'https://www.hostelworld.com',
    },
    {
      title: 'Airbnb',
      type: 'airbnb',
      url: 'https://www.airbnb.com',
    },
    {
      title: 'Booking',
      type: 'booking',
      url: 'https://www.booking.com',
    },
  ];

  const handleWeb = (type) => {
    setWebInfo({
      ...affData.find((data) => data.type === type),
      url: generateUrl(type),
      isVisible: true,
    });
  };

  const generateUrl = (type) => {
    const adults = amountPeople;
    const location = destinations[index].placeName;
    const checkIn = Utils.getDateFromTimestamp(dates.start, 'YYYY-MM-DD');
    const checkOut = Utils.getDateFromTimestamp(dates.end, 'YYYY-MM-DD');
    // https://www.airbnb.co.uk/s/Oaxaca/homes?query=Oaxac&checkin=2023-03-19&checkout=2023-04-04&adults=2
    // https://www.booking.com/ss=mexico%20city&checkin=2023-03-23&checkout=2023-03-26&group_adults=1
    // https://www.getyourguide.co.uk/s?q=Oaxaca%20de%20JuarezMexico&date_from=2023-08-02&date_to=2023-08-04
    const AIRBNB_URL = `https://www.airbnb.com/s/${location}/homes?query=${location}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`;
    const BOOKING_URL = `https://www.booking.com/ss=${location}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}`;
    const YOURGUIDE_URL = `https://getyourguide.com/s?q=${location}&date_from=${checkIn}`;

    console.log(YOURGUIDE_URL);
    if (type === 'airbnb') {
      return AIRBNB_URL;
    }
    if (type === 'booking') {
      return BOOKING_URL;
    }
    if (type === 'hostelworld') {
      return YOURGUIDE_URL;
    }
    if (type === 'hostelworld') {
      return BOOKING_URL;
    }
  };

  const handleCounter = (amount) => {
    if (amount === -1) {
      setNightsCounter((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      setNightsCounter((prev) => (prev + 1));
    }
  };

  const getSimpleButton = (image, string, _onPress) => (
    <Pressable
      onPress={_onPress}
      style={styles.simpleButton}
    >
      <Image
        style={{ height: 18, width: 18 }}
        source={image}
      />
      <Body
        type={1}
        style={{ fontWeight: '500', marginLeft: 6 }}
        text={string}
      />
    </Pressable>
  );

  return (
    <>
      <View style={{ marginHorizontal: PADDING.l, alignItems: 'flex-start', marginTop: 30 }}>
        <ActivityChip data={link} />
        <Body
          type={1}
          color={COLORS.neutral[300]}
          text={title}
          style={{ marginTop: 12, marginBottom: 2 }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Headline
            type={4}
            text={destinations[index].placeName}
          />
          {destinations[index + 1] && isTransport && (
          <>
            <Body
              style={{ marginHorizontal: 4 }}
              type={1}
              color={COLORS.neutral[300]}
              text={i18n.t('to')}
            />
            <Headline
              type={4}
              text={destinations[index + 1].placeName}
            />
          </>
          )}
        </View>
        <View style={[styles.innerContainer, { marginTop: 16 }]}>
          <View style={{ flex: 1 }}>
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={placeHolder}
            />
            <Body
              type={1}
              color={COLORS.shades[900]}
              text={Utils.getDateFromTimestamp(dates.start, 'MMM Do YYYY')}
            />
          </View>
          {isSleep && (
          <View style={{ flex: 1 }}>
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={i18n.t('To')}
            />
            <Body
              type={1}
              color={COLORS.shades[900]}
              text={Utils.getDateFromTimestamp(dates.end, 'MMM Do YYYY')}
            />
          </View>
          )}
        </View>
        {isSleep && (
        <View style={[styles.innerContainer, { marginTop: 16 }]}>
          <Pressable
            onPress={() => handleCounter(-1)}
            style={{
              flex: 1, alignItems: 'flex-start', paddingLeft: 15, height: 40, justifyContent: 'center',
            }}
          >
            <EntIcon name="minus" size={20} />
          </Pressable>
          <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={i18n.t('Nights')}
            />
            <Headline
              type={4}
              color={COLORS.shades[900]}
              text={nightsCounter}
            />
          </View>
          <Pressable
            onPress={() => handleCounter(+1)}
            style={{
              flex: 1, alignItems: 'flex-end', paddingRight: 15, height: 40, justifyContent: 'center',
            }}
          >
            <EntIcon name="plus" size={20} />
          </Pressable>
        </View>
        )}
        <Headline
          type={4}
          style={{ marginTop: 40, marginBottom: 2 }}
          text={findTitle}
        />
        <Body
          type={1}
          color={COLORS.neutral[300]}
          text={i18n.t('For 2 nights for 2 people')}
        />
        <View style={{ flexDirection: 'row', marginBottom: 6, marginTop: 30 }}>
          {getSimpleButton(BookinLogo, 'Booking', () => handleWeb('booking'))}
          {getSimpleButton(AirbnbLogo, 'Airbnb', () => handleWeb('airbnb'))}
        </View>
        {getSimpleButton(HostelworldLogo, 'Hostelworld', () => handleWeb('hostelworld'))}
      </View>
      <WebViewModal
        url={webInfo?.url}
        isVisible={webInfo?.isVisible}
        onRequestClose={() => setWebInfo((prev) => ({
          ...prev,
          isVisible: false,
        }))}
        title={webInfo?.title}
      />
    </>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    marginHorizontal: -4,
    borderColor: COLORS.neutral[100],
    flexDirection: 'row',
    paddingHorizontal: 13,
    paddingVertical: 10,
    alignItems: 'center',
  },
  simpleButton: {
    marginRight: 6,
    borderRadius: 100,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
    flexDirection: 'row',
    height: 42,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
