import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import AnimatedHeader from './AnimatedHeader';
import BackButton from './BackButton';
import Headline from './typography/Headline';
import BasicHeader from './BasicHeader';
import COLORS from '../constants/Theme';

export default function HybridHeader({
  style,
  title,
  subtitle,
  onPressBack,
  info,
  children,
  scrollY,
  content,
  backButton = true,
  backgroundColor = COLORS.shades[0],
  trailing,
  scrollEnabled = true,
  centerComponent,
}) {
  return (
    <View style={{flex: 1}}>
      {backButton && (
        <SafeAreaView style={styles.backButton}>
          <BackButton isClear onPress={onPressBack} />
        </SafeAreaView>
      )}
      <AnimatedHeader
        maxHeight={110}
        minHeight={10}
        style={style}
        scrollY={scrollY}>
        <SafeAreaView
          style={{
            flex: 1,
            // marginTop: -25,
            marginBottom: -24,
          }}>
          <Headline
            style={{alignSelf: 'center', paddingTop: 25}}
            type={3}
            text={title}
          />
        </SafeAreaView>
      </AnimatedHeader>
      <Animated.ScrollView
        ref={scrollY}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
        <BasicHeader
          style={{
            paddingTop: Platform.OS === 'android' ? 840 : 800,
            marginTop: backButton ? -760 : -790,
            backgroundColor,
          }}
          scrollY={scrollY}
          title={title}
          subtitle={subtitle}
          info={info}
          centerComponent={centerComponent}
          trailing={trailing}>
          {content || null}
        </BasicHeader>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 9999,
    left: 20,
    top: 15,
  },
  title: {
    zIndex: 10,
    bottom: 10,
    position: 'absolute',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
});
