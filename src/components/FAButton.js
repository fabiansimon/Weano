import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useRef, useState} from 'react';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Headline from './typography/Headline';
import Utils from '../utils';
import Body from './typography/Body';
import PopUpModal from './PopUpModal';
import i18n from '../utils/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const {width} = Dimensions.get('window');

export default function FAButton({
  style,
  onPress,
  icon,
  iconSize = 22,
  string,
  isLoading = false,
  options = [],
  isDisabled = false,
  description,
}) {
  // STATE && MISC
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedOffset = useRef(new Animated.Value(0)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

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
      Animated.spring(animatedRotation, {
        toValue: 1,
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
      Animated.spring(animatedRotation, {
        toValue: 0,
        duration,
        bounciness: 0.2,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded]);

  const iconRotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

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
        {!isExpanded && description && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              position: 'absolute',
              width,
              right: 65,
            }}>
            <Body
              style={{
                textAlign: 'left',
              }}
              color={COLORS.neutral[300]}
              type={2}
              text={description}
            />
            <AntIcon
              name="arrowright"
              style={{marginBottom: 3, marginLeft: 2}}
              color={COLORS.neutral[300]}
            />
          </View>
        )}
        {options?.map((option, index) => getOptionButton(option, index))}
        <AnimatedPressable
          disabled={isLoading}
          onPress={() => {
            if (isDisabled) {
              return setIsVisible(true);
            }

            options.length <= 0 ? onPress() : setIsExpanded(prev => !prev);
          }}
          style={[
            styles.fab,
            {
              transform: [{rotate: iconRotation}],
              paddingHorizontal: string ? PADDING.l : 0,
              backgroundColor: isDisabled
                ? Utils.addAlpha(COLORS.primary[700], 0.3)
                : isExpanded
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
              <Icon name={icon} color={COLORS.shades[0]} size={iconSize} />
            </>
          )}
        </AnimatedPressable>
      </View>
      <PopUpModal
        isVisible={isVisible}
        autoClose
        title={i18n.t('Sorry!')}
        subtitle={i18n.t(
          "You can't add or edit any items after the trip is finished.",
        )}
        onRequestClose={() => setIsVisible(false)}
      />
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
    bottom: Platform.OS === 'android' ? 30 : 40,
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
