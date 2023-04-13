import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useEffect, useRef, useState} from 'react';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Headline from './typography/Headline';
import Utils from '../utils';
import Body from './typography/Body';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FAButton({
  style,
  onPress,
  icon,
  iconSize = 22,
  string,
  isLoading = false,
  options = [],
}) {
  // STATE && MISC
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedOffset = useRef(new Animated.Value(0)).current;

  const duration = 200;

  useEffect(() => {
    if (isExpanded) {
      Animated.spring(animatedOpacity, {
        toValue: 1,
        duration,
        bounciness: 0.2,
        useNativeDriver: false,
      }).start();
      Animated.spring(animatedOffset, {
        toValue: 55,
        duration,
        bounciness: 0.2,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animatedOpacity, {
        toValue: 0,
        duration,
        bounciness: 0.2,
        useNativeDriver: false,
      }).start();
      Animated.spring(animatedOffset, {
        toValue: 0,
        duration,
        bounciness: 0.2,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const getOptionButton = (option, index) => {
    const {title, icon: iconName, onPress: onTap} = option;

    return (
      <AnimatedPressable
        onPress={() => {
          onTap();
          setIsExpanded(false);
        }}
        style={{
          flexDirection: 'row',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'flex-end',
          right: 7,
          transform: [
            {translateY: Animated.multiply(animatedOffset, (index + 1) * -1)},
          ],
        }}>
        {isExpanded && (
          <Body
            text={title}
            color={COLORS.shades[0]}
            style={{width: 100, textAlign: 'right', marginRight: 10}}
          />
        )}
        <View style={styles.miniFab}>
          <Icon
            name={iconName}
            size={22}
            style={{marginLeft: 1}}
            color={COLORS.shades[0]}
          />
        </View>
      </AnimatedPressable>
    );
  };

  return (
    <>
      <AnimatedPressable
        onPress={() => setIsExpanded(false)}
        style={[
          styles.container,
          {
            transform: [{translateX: isExpanded ? 0 : -1000}],
            opacity: animatedOpacity,
          },
        ]}
      />
      <View style={styles.fabContainer}>
        {options?.map((option, index) => getOptionButton(option, index))}
        <Pressable
          disabled={isLoading}
          onPress={() =>
            options.length <= 0 ? onPress() : setIsExpanded(prev => !prev)
          }
          style={[
            styles.fab,
            {
              paddingHorizontal: string ? PADDING.l : 0,
              backgroundColor: isExpanded
                ? COLORS.neutral[900]
                : COLORS.primary[700],
            },
            style,
          ]}>
          {isLoading ? (
            <ActivityIndicator color={COLORS.shades[0]} />
          ) : (
            <>
              <Headline type={4} color={COLORS.shades[0]} text={string} />
              <Icon
                name={isExpanded ? 'close' : icon}
                color={COLORS.shades[0]}
                size={iconSize}
              />
            </>
          )}
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    flexDirection: 'row',
    height: 55,
    minWidth: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    shadowColor: COLORS.neutral[500],
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {},
  },
  fabContainer: {
    position: 'absolute',
    bottom: 50,
    right: PADDING.l,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.8),
    position: 'absolute',
  },
  miniFab: {
    backgroundColor: COLORS.primary[700],
    height: 40,
    width: 40,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
