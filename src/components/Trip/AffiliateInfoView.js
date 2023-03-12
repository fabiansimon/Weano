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

export default function AffiliateInfoView({ info, destinations, dateRange }) {
  // STATE & MISC
  const [nightsCounter, setNightsCounter] = useState(0);

  useEffect(() => {
    const diff = Utils.getDaysDifference(dateRange.startDate, dateRange.endDate, true);
    setNightsCounter(parseInt((diff / destinations.length).toFixed(0), 10));
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
            text="02/06/2022"
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
            text="04/06/2022"
          />
        </View>
        )}
      </View>
      {isSleep && (
      <View style={[styles.innerContainer, { marginTop: 16 }]}>
        <Pressable
          onPress={() => setNightsCounter((prev) => (prev > 1 ? prev - 1 : 1))}
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
          onPress={() => setNightsCounter((prev) => prev + 1)}
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
        {getSimpleButton(BookinLogo, 'Booking', () => console.log('hello'))}
        {getSimpleButton(AirbnbLogo, 'Airbnb', () => console.log('hello'))}
      </View>
      {getSimpleButton(HostelworldLogo, 'Hostelworld', () => console.log('hello'))}
    </View>
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
