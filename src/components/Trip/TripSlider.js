import {Animated, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Body from '../typography/Body';
import i18n from '../../utils/i18n';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../../constants/Routes';

const WIDTH = 270;

export default function TripSlider({index, style, onPress}) {
  // STATE && MISC
  const translateX = useRef(new Animated.Value(900)).current;

  const navigation = useNavigation();

  const duration = 200;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: (WIDTH / 3) * index - 4 * index,
      duration,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <Animated.View style={[styles.slider, {transform: [{translateX}]}]} />
      <View style={styles.textContainer}>
        <Icon
          size={14}
          name="airplane"
          color={!index ? COLORS.shades[0] : COLORS.neutral[500]}
        />
        <Body
          type={1}
          color={!index ? COLORS.shades[0] : COLORS.neutral[500]}
          style={{fontWeight: '500', marginLeft: 5}}
          text={i18n.t('Trip')}
        />
      </View>
      <View style={[styles.textContainer, {marginLeft: -10}]}>
        <FontIcon
          name="globe"
          size={16}
          color={index ? COLORS.shades[0] : COLORS.neutral[500]}
        />
        <Body
          type={1}
          color={index ? COLORS.shades[0] : COLORS.neutral[500]}
          style={{fontWeight: '500', marginLeft: 5}}
          text={i18n.t('Map')}
        />
      </View>
      <Pressable
        onPress={() =>
          navigation.navigate(ROUTES.chatScreen, {
            roomId: 'm7YBncJHZLEl5544E6gD',
          })
        }
        style={[styles.textContainer, {marginLeft: -10}]}>
        <Icon
          name="ios-chatbubbles-outline"
          size={20}
          color={COLORS.neutral[500]}
        />
        <Body
          type={1}
          color={COLORS.neutral[500]}
          style={{fontWeight: '500', marginLeft: 5}}
          text={i18n.t('Chat')}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.neutral[500],
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.11,
    shadowRadius: 20,
    flexDirection: 'row',
    width: WIDTH,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    height: 55,
  },
  textContainer: {
    borderRadius: RADIUS.xl,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  slider: {
    width: WIDTH / 3,
    height: '92%',
    margin: 2,
    backgroundColor: COLORS.primary[700],
    position: 'absolute',
    borderRadius: RADIUS.xl,
  },
});
