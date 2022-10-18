import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedHeader from './AnimatedHeader';
import BackButton from './BackButton';
import Headline from './typography/Headline';
import BasicHeader from './BasicHeader';
import { PADDING } from '../constants/Theme';

export default function HybridHeader({
  style, title, subtitle, onPressBack, info, children, scrollY, content, backButton = true, backgroundColor,
}) {
  return (
    <View style={{ flex: 1 }}>
      {backButton && (
      <SafeAreaView style={styles.backButton}>
        <BackButton isClear onPress={onPressBack} />
      </SafeAreaView>
      )}
      <AnimatedHeader
        maxHeight={160}
        style={[style, { justifyContent: 'flex-end', opacity: 1 }]}
        scrollY={scrollY}
      >
        <View style={styles.animatedHeader}>
          <View style={styles.title}>
            <Headline
              style={{ textAlign: 'center' }}
              type={2}
              text={title}
            />
          </View>
        </View>
      </AnimatedHeader>
      <Animated.ScrollView
        ref={scrollY}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <BasicHeader
          style={{ paddingTop: 800, marginTop: backButton ? -750 : -780, backgroundColor }}
          scrollY={scrollY}
          title={title}
          subtitle={subtitle}
          info={info}
        >
          {content}
        </BasicHeader>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedHeader: {
    paddingBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: PADDING.m,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    zIndex: 9999,
    left: 20,
    top: 20,
  },
  title: {
    zIndex: 10,
    bottom: 10,
    position: 'absolute',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
});
