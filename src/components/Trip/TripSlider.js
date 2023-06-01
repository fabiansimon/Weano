import {Animated, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Body from '../typography/Body';
import i18n from '../../utils/i18n';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../../constants/Routes';

export default function TripSlider({index, style, onPress, showChat = true}) {
  const WIDTH = !showChat ? 180 : 270;
  const ITEM_COUNT = !showChat ? 2 : 3;
  // STATE && MISC
  const translateX = useRef(new Animated.Value(900)).current;

  const navigation = useNavigation();

  const duration = 200;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: (WIDTH / ITEM_COUNT) * index - 2 * index,
      duration,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style, {width: WIDTH}]}>
      <Animated.View
        style={[
          styles.slider,
          {transform: [{translateX}], width: WIDTH / ITEM_COUNT},
        ]}
      />
      <View style={styles.textContainer}>
        <Icon
          size={14}
          name="airplane"
          color={!index ? COLORS.shades[0] : COLORS.neutral[300]}
        />
        <Body
          type={2}
          color={!index ? COLORS.shades[0] : COLORS.neutral[300]}
          style={{fontWeight: '500', marginLeft: 5}}
          text={i18n.t('Trip')}
        />
      </View>
      <View style={[styles.textContainer, {marginLeft: -10}]}>
        <FontIcon
          name="globe"
          size={16}
          color={index ? COLORS.shades[0] : COLORS.neutral[300]}
        />
        <Body
          type={2}
          color={index ? COLORS.shades[0] : COLORS.neutral[300]}
          style={{fontWeight: '500', marginLeft: 5}}
          text={i18n.t('Map')}
        />
      </View>
      {showChat && (
        <Pressable
          onPress={() => navigation.push(ROUTES.chatScreen)}
          style={[styles.textContainer, {marginLeft: -10}]}>
          <Icon
            name="md-chatbubbles-outline"
            size={18}
            color={COLORS.neutral[300]}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            style={{fontWeight: '500', marginLeft: 5}}
            text={i18n.t('Chat')}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.neutral[500],
    shadowOffset: {height: 5, x: 0},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 45,
    alignSelf: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    height: 50,
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
    height: '100%',
    margin: 0.5,
    backgroundColor: COLORS.primary[700],
    position: 'absolute',
    borderRadius: RADIUS.xl,
  },
});
