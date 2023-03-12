import {
  View, StyleSheet, Pressable, Dimensions,
  Image,
} from 'react-native';
import React, { useRef, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/Ionicons';
import EntIcon from 'react-native-vector-icons/Entypo';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Subtitle from '../typography/Subtitle';
import Body from '../typography/Body';
import TripStopTile from './TripStopTile';
import ActivityChip from '../ActivityChip';
import AirbnbLogo from '../../../assets/images/airbnb.png';
import BookinLogo from '../../../assets/images/booking.png';
import HostelworldLogo from '../../../assets/images/hostelworld.png';

export default function DestinationsSheet({
  destinations, onDragEnded, onAdd, onDelete, position, onPress, onReplace, dateRange,
}) {
  // STATE & MISC
  const [info, setInfo] = useState('accomodation');
  const { height } = Dimensions.get('window');
  const isLast = destinations.length <= 1;
  const pageRef = useRef();

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = Math.abs((height - position.value) - height);
    return {
      transform: [{ translateY }],
    };
  });

  const handleFurtherInfo = (type, item) => {
    setInfo({
      type: 'accomdation',
      placeName: item.placeName,
      dateRange,

    });
    setTimeout(() => {
      pageRef.current?.setPage(1);
    }, 100);
  };

  const affiliateLinks = [
    {
      title: i18n.t('Sleep'),
      icon: <Icon
        name="ios-bed"
        size={16}
        color={COLORS.secondary[700]}
      />,
      color: COLORS.secondary[700],
      type: 'accomodation',
    },
    {
      title: i18n.t('Transport'),
      icon: <Icon
        name="airplane"
        size={16}
        color={COLORS.primary[700]}
      />,
      color: COLORS.primary[700],
      type: 'transport',
    },
    {
      title: i18n.t('Discover'),
      icon: <Icon
        name="compass-outline"
        size={20}
        color={COLORS.success[900]}
      />,
      color: COLORS.success[900],
      type: 'discover',
    },
    {
      title: i18n.t('Food'),
      icon: <Icon
        name="ios-restaurant"
        size={14}
        color={COLORS.warning[900]}
      />,
      color: COLORS.warning[900],
      type: 'food',
    },
  ];

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

  const getDestinationTile = (destination) => {
    const {
      isActive, item, drag, getIndex,
    } = destination;

    const index = getIndex();
    return (
      <TripStopTile
        onInfoTap={(type, _item) => handleFurtherInfo(type, _item)}
        links={affiliateLinks}
        onDelete={onDelete}
        onReplace={onReplace}
        index={index}
        isActive={isActive}
        isLast={isLast}
        item={item}
        drag={drag}
      />
    );
  };
  const getAddTile = () => (
    <Pressable
      onPress={onAdd}
      style={styles.tileContainer}
    >
      <View style={[styles.numberContainer, { backgroundColor: COLORS.neutral[300] }]}>
        <View style={styles.line} />
        <Subtitle
          type={1}
          color={COLORS.shades[0]}
          style={{ marginRight: -0.5, fontWeight: '500' }}
          text="+"
        />
      </View>
      <Body
        color={COLORS.neutral[300]}
        type={1}
        text={i18n.t('Add another stop')}
      />
    </Pressable>
  );

  return (
    <>
      <Animated.View style={[{
        minHeight: 50, backgroundColor: COLORS.neutral[50], bottom: -20, zIndex: 0,
      }, animatedStyle]}
      />
      <Pressable
        onPress={onPress}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.handler} />
          <PagerView
            style={{ flex: 1 }}
            ref={pageRef}
            scrollEnabled
          >
            <View>
              <Headline
                type={4}
                color={COLORS.neutral[900]}
                text={i18n.t('Trip start')}
                style={{ marginBottom: 10, marginTop: 18, marginLeft: PADDING.l }}
              />
              <DraggableFlatList
                data={destinations}
                scrollEnabled={false}
                onDragEnd={({ data }) => onDragEnded(data)}
                keyExtractor={(item) => item.key}
                renderItem={(item) => getDestinationTile(item)}
              />
              {getAddTile()}
            </View>
            <View style={{ marginHorizontal: PADDING.l, alignItems: 'flex-start', marginTop: 30 }}>
              <ActivityChip data={affiliateLinks[0]} />
              <Body
                type={1}
                color={COLORS.neutral[300]}
                text={i18n.t('Sleep in')}
                style={{ marginTop: 12, marginBottom: 2 }}
              />
              <Headline
                type={4}
                text={info.placeName}
              />
              <View style={[styles.innerContainer, { marginTop: 16 }]}>
                <View style={{ flex: 1 }}>
                  <Body
                    type={2}
                    color={COLORS.neutral[300]}
                    text={i18n.t('From')}
                  />
                  <Body
                    type={1}
                    color={COLORS.shades[900]}
                    text="02/06/2022"
                  />
                </View>
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
              </View>
              <View style={[styles.innerContainer, { marginTop: 16 }]}>
                <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 15 }}>
                  <EntIcon name="plus" size={20} />
                </View>
                <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                  <Body
                    type={2}
                    color={COLORS.neutral[300]}
                    text={i18n.t('Nights')}
                  />
                  <Headline
                    type={4}
                    color={COLORS.shades[900]}
                    text="2"
                  />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 15 }}>
                  <EntIcon name="minus" size={20} />
                </View>
              </View>
              <Headline
                type={4}
                style={{ marginTop: 40, marginBottom: 2 }}
                text={i18n.t('Find accomodation')}
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
          </PagerView>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral[50],
    flex: 1,
    borderTopRightRadius: RADIUS.m,
    borderTopLeftRadius: RADIUS.m,
  },
  handler: {
    alignSelf: 'center',
    width: 60,
    height: 7,
    borderRadius: 100,
    backgroundColor: COLORS.neutral[100],
    marginTop: 10,
  },
  tileContainer: {
    paddingVertical: 12,
    backgroundColor: COLORS.neutral[50],
    borderLeftColor: COLORS.neutral[100],
    borderLeftWidth: 2,
    left: 40,
    marginRight: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  numberContainer: {
    top: 4,
    left: -11,
    backgroundColor: COLORS.primary[700],
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
  },
  innerContainer: {
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.s,
    borderWidth: 1,
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
