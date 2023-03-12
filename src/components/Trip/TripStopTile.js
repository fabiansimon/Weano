import {
  View, Pressable, StyleSheet, Animated,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import COLORS, { RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Subtitle from '../typography/Subtitle';
import SwipeView from '../SwipeView';
import Body from '../typography/Body';
import ActivityChip from '../ActivityChip';

export default function TripStopTile({
  isLast, onReplace, onDelete, index, isActive, drag, item, links, onInfoTap,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const duration = 300;

  useEffect(() => {
    if (isExpanded) {
      Animated.spring(animatedHeight, {
        toValue: 80,
        duration,
        bounciness: 0.2,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animatedHeight, {
        toValue: 0,
        bounciness: 0.2,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded]);

  return (
    <SwipeView
      onDelete={() => (isLast ? onReplace() : onDelete(index))}
      backgroundColor={isLast ? COLORS.primary[700] : COLORS.error[900]}
      string={isLast ? i18n.t('Replace') : i18n.t('Delete')}
    >
      <ScaleDecorator activeScale={1.05}>
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
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
              text={index + 1}
            />
          </View>
          <View>
            <Body
              style={{ flex: 1, marginRight: 20 }}
              numberOfLines={2}
              ellipsizeMode="tail"
              type={1}
              text={item.placeName}
            />
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={isExpanded ? i18n.t('Tap to minimize') : i18n.t('Tap to expend')}
            />
            <Animated.View style={{ height: animatedHeight, top: 4 }}>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <ActivityChip data={links[0]} onPress={() => onInfoTap(links[0].type, item)} />
                <ActivityChip data={links[1]} onPress={() => onInfoTap(links[1].type, item)} />
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <ActivityChip data={links[2]} onPress={() => onInfoTap(links[2].type, item)} />
                <ActivityChip data={links[3]} onPress={() => onInfoTap(links[3].type, item)} />
              </View>
            </Animated.View>
          </View>
        </Pressable>
      </ScaleDecorator>
    </SwipeView>
  );
}

const styles = StyleSheet.create({
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
