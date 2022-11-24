import {
  View, SafeAreaView, Pressable, StyleSheet, Animated,
} from 'react-native';
import { createAnimatableComponent } from 'react-native-animatable';
import IonIcon from 'react-native-vector-icons/Ionicons';
import React, { useRef, useState, useEffect } from 'react';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';

export default function ActiveTripContainer({ isVisible }) {
  const [isHidden, setIsHidden] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const duration = 100;

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

  const toggleModal = () => {
    if (isHidden) {
      setIsHidden(true);
      Animated.spring(translateY, {
        toValue: 400,
        duration,
        useNativeDriver: true,
        bounciness: 0.4,
      }).start();
    } else {
      setTimeout(() => setIsHidden(false), duration);
      Animated.spring(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
        bounciness: 0.4,
      }).start();
    }
  };

  const AnimatedPressable = createAnimatableComponent(Pressable);
  return (
    <AnimatedPressable
      style={[styles.activeTripContainer, {
        transform: [{ translateY }],
      }]}
    >
      <SafeAreaView edges={['bottom']}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18,
        }}
        >
          <Headline
            type={4}
            color={COLORS.shades[0]}
            text={i18n.t('Ongoing Trip')}
          />
          <IonIcon
            onPress={() => setIsHidden(true)}
            name="ios-chevron-down-circle-sharp"
            color={COLORS.primary[300]}
            size={26}
          />
        </View>
        <Headline
          type={1}
          color={COLORS.shades[0]}
          text="Vienna, Austria"
        />
      </SafeAreaView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  activeTripContainer: {
    paddingHorizontal: PADDING.m,
    bottom: 0,
    paddingBottom: 60,
    width: '100%',
    position: 'absolute',
    backgroundColor: COLORS.primary[700],
    borderTopLeftRadius: RADIUS.m,
    borderTopRightRadius: RADIUS.m,
  },
});
