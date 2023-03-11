import {
  View, StyleSheet, Pressable, Dimensions,
} from 'react-native';
import React from 'react';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Subtitle from '../typography/Subtitle';
import SwipeView from '../SwipeView';
import Body from '../typography/Body';

export default function DestinationsSheet({
  destinations, onDragEnded, onAdd, onDelete, position, onPress,
}) {
  const { height } = Dimensions.get('window');

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = Math.abs((height - position.value) - height);
    return {
      transform: [{ translateY }],
    };
  });
  const getDestinationTile = (destination) => {
    const {
      isActive, item, drag, getIndex,
    } = destination;
    return (
      <SwipeView onDelete={() => onDelete(getIndex())}>
        <ScaleDecorator activeScale={1.05}>
          <Pressable
            onLongPress={(() => {
              drag();
              ReactNativeHapticFeedback.trigger('impactLight');
            })}
            disabled={isActive}
            style={styles.tileContainer}
          >
            <View style={styles.numberContainer}>
              <View style={styles.line} />
              <Subtitle
                type={1}
                color={COLORS.shades[0]}
                text={getIndex() + 1}
              />
            </View>
            <Body
              type={1}
              text={item.placeName}
            />
          </Pressable>
        </ScaleDecorator>
      </SwipeView>
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
        minHeight: 50, backgroundColor: COLORS.shades[0], bottom: -20, zIndex: 0,
      }, animatedStyle]}
      />
      <Pressable
        onPress={onPress}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.handler} />
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
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.shades[0],
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
  numberContainer: {
    left: -11,
    backgroundColor: COLORS.primary[700],
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
  },
  tileContainer: {
    height: 53,
    backgroundColor: COLORS.shades[0],
    borderLeftColor: COLORS.neutral[100],
    borderLeftWidth: 2,
    left: 40,
    marginRight: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
