import {View, StyleSheet, Pressable, Dimensions, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Subtitle from '../typography/Subtitle';
import Body from '../typography/Body';
import TripStopTile from './TripStopTile';
import AffiliateInfoView from './AffiliateInfoView';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';

const MAX_LENGTH = 15;

const {width, height} = Dimensions.get('window');

export default function DestinationsSheet({
  destinations,
  onDragEnded,
  onAdd,
  onDelete,
  isHost,
  position,
  handleExpending,
  onReplace,
  dateRange,
  navigateRef,
  setScrollIndex,
  sheetIndex,
  amountPeople,
}) {
  // STATE & MISC
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [info, setInfo] = useState(null);

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
      isDisbled: destinations.length <= 1,
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
      setScrollIndex(1);
      pageRef.current?.scrollTo({x: 1000});
    }, 100);
  };

  const getDestinationTile = destination => {
    const {isActive, item, drag, getIndex} = destination;

    const index = getIndex();
    const activeLinks = affiliateLinks.filter(link => !link.isDisbled);

    return (
      <TripStopTile
        onInfoTap={(t, _item) => handleFurtherInfo(t, _item)}
        links={activeLinks}
        isHost={isHost}
        onDelete={onDelete}
        onReplace={onReplace}
        index={index}
        isActive={isActive}
        isLast={isLast}
        item={item}
        drag={drag}
        isExpanded={index === expandedIndex}
        onPress={() => {
          if (sheetIndex === 0) {
            handleExpending();
          }
          setExpandedIndex(index === expandedIndex ? -1 : index);
        }}
      />
    );
  };

  const getAddTile = () => (
    <Pressable disabled={!isHost} onPress={onAdd} style={styles.tileContainer}>
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
      <View>
        <Body
          color={COLORS.neutral[300]}
          type={1}
          style={{marginTop: 2}}
          text={i18n.t('Add another stop')}
        />
        {!isHost && (
          <View style={styles.lockedContainer}>
            <Icon color={COLORS.neutral[500]} size={12} name="md-lock-closed" />
            <Subtitle
              type={2}
              style={{
                marginLeft: 4,
              }}
              color={COLORS.neutral[500]}
              text={i18n.t('Must be host')}
            />
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Animated.View
        style={[
          {
            minHeight: Platform.OS === 'android' ? 25 : 50,
            backgroundColor: COLORS.neutral[50],
            bottom: -20,
            zIndex: 0,
          },
          animatedStyle,
        ]}
      />

      <Pressable onPress={handleExpending} style={styles.container}>
        <Pressable style={styles.handler} />
        <ScrollView
          ref={node => {
            navigateRef.current = node;
            pageRef.current = node;
          }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            width: width * 2,
          }}>
          <View style={{width}}>
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
            {destinations?.length < MAX_LENGTH && getAddTile()}
          </View>
          <AffiliateInfoView
            amountPeople={amountPeople}
            info={info}
            destinations={destinations}
            dateRange={dateRange}
          />
        </ScrollView>
      </Pressable>
    </GestureHandlerRootView>
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
  lockedContainer: {
    marginRight: 'auto',
    marginTop: 6,
    marginLeft: -2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.neutral[100],
  },
});
