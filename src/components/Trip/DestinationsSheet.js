import {View, StyleSheet, Pressable, Dimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Subtitle from '../typography/Subtitle';
import Body from '../typography/Body';
import TripStopTile from './TripStopTile';
import AffiliateInfoView from './AffiliateInfoView';

const MAX_LENGTH = 15;

export default function DestinationsSheet({
  destinations,
  onDragEnded,
  onAdd,
  onDelete,
  position,
  handleExpending,
  onReplace,
  dateRange,
  navigateRef,
  setScrollIndex,
  sheetIndex,
  amountPeople,
  isRecent,
}) {
  // STATE & MISC
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [info, setInfo] = useState(null);

  const {height} = Dimensions.get('window');
  const isLast = destinations.length <= 1;
  const pageRef = useRef();
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = Math.abs(height - position.value - height);
    return {
      transform: [{translateY}],
    };
  });

  const affiliateLinks = [
    {
      title: i18n.t('Sleep'),
      icon: <Icon name="ios-bed" size={16} color={COLORS.secondary[700]} />,
      color: COLORS.secondary[700],
      type: 'sleep',
    },
    {
      title: i18n.t('Transport'),
      icon: <Icon name="airplane" size={16} color={COLORS.primary[700]} />,
      color: COLORS.primary[700],
      type: 'transport',
    },
    {
      title: i18n.t('Discover'),
      icon: (
        <Icon name="compass-outline" size={20} color={COLORS.success[900]} />
      ),
      color: COLORS.success[900],
      type: 'discover',
    },
    {
      title: i18n.t('Food'),
      icon: (
        <Icon name="ios-restaurant" size={14} color={COLORS.warning[900]} />
      ),
      color: COLORS.warning[900],
      type: 'food',
    },
  ];

  useEffect(() => {
    if (!sheetIndex) {
      setExpandedIndex(-1);
    }
  }, [sheetIndex]);

  const handleFurtherInfo = (link, index) => {
    setInfo({
      link,
      index,
    });

    setTimeout(() => {
      pageRef.current?.setPage(1);
    }, 100);
  };

  const getDestinationTile = destination => {
    const {isActive, item, drag, getIndex} = destination;

    const index = getIndex();
    return (
      <TripStopTile
        onInfoTap={(t, _item) => handleFurtherInfo(t, _item)}
        links={affiliateLinks}
        onDelete={onDelete}
        onReplace={onReplace}
        index={index}
        isActive={isActive}
        isLast={isLast}
        item={item}
        drag={drag}
        disabled={isRecent}
        isExpanded={index === expandedIndex}
        onPress={() => {
          if (isRecent) {
            return;
          }

          if (sheetIndex === 0) {
            handleExpending();
          }
          setExpandedIndex(index === expandedIndex ? -1 : index);
        }}
      />
    );
  };

  const getAddTile = () => (
    <Pressable onPress={onAdd} style={styles.tileContainer}>
      <View
        style={[
          styles.numberContainer,
          {backgroundColor: COLORS.neutral[300]},
        ]}>
        <View style={styles.line} />
        <Subtitle
          type={1}
          color={COLORS.shades[0]}
          style={{marginRight: -0.5, fontWeight: '500'}}
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
      <Animated.View
        style={[
          {
            minHeight: 50,
            backgroundColor: COLORS.neutral[50],
            bottom: -20,
            zIndex: 0,
          },
          animatedStyle,
        ]}
      />

      <Pressable style={styles.container}>
        <Pressable style={styles.handler} />
        <PagerView
          style={{flex: 1}}
          ref={node => {
            navigateRef.current = node;
            pageRef.current = node;
          }}
          onPageSelected={e => setScrollIndex(e.nativeEvent.position)}
          scrollEnabled={false}>
          <View>
            <Headline
              type={4}
              color={COLORS.neutral[900]}
              text={i18n.t('Trip start')}
              style={{marginBottom: 10, marginTop: 18, marginLeft: PADDING.l}}
            />
            <DraggableFlatList
              data={destinations}
              scrollEnabled={false}
              onDragEnd={({data}) => onDragEnded(data)}
              keyExtractor={item => item.key}
              renderItem={item => getDestinationTile(item)}
            />
            {!isRecent && destinations?.length < MAX_LENGTH && getAddTile()}
          </View>
          <AffiliateInfoView
            amountPeople={amountPeople}
            info={info}
            destinations={destinations}
            dateRange={dateRange}
          />
        </PagerView>
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
});
