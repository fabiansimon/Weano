import {
  View, SafeAreaView, Pressable, StyleSheet,
} from 'react-native';
// import IonIcon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import COLORS, { PADDING } from '../constants/Theme';

export default function ActiveTripContainer({ style, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.activeTripContainer, style]}
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

        </View>
        <Headline
          type={1}
          color={COLORS.shades[0]}
          text="Vienna, Austria"
        />
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activeTripContainer: {
    paddingHorizontal: PADDING.m,
    width: '100%',
    backgroundColor: COLORS.primary[700],
  },
});
