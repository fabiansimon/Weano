import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import Headline from '../typography/Headline';
import COLORS, { RADIUS } from '../../constants/Theme';

export default function PollTile({
  style, data, onPress, isActive, percentage, height = 50,
}) {
  const color = isActive ? COLORS.shades[0] : COLORS.neutral[500];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={style}
    >
      <View style={[styles.optionTileContainer, { height }]}>
        <View style={[isActive ? styles.activeContainerOverlay : styles.inactiveContainerOverlay, { width: percentage, height }]} />
        <MaskedView
          style={styles.optionTile}
          maskElement={(
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 14,
                alignItems: 'center',
              }}
            >
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', flex: 1,
              }}
              >
                <Headline
                  type={4}
                  color={COLORS.neutral[500]}
                  text={data.option}
                />
                <Headline
                  type={4}
                  color={COLORS.neutral[500]}
                  text={percentage}
                />
              </View>
            </View>
              )}
        >
          <View style={{ backgroundColor: color, width: percentage, height: 45 }} />
          <View style={{ backgroundColor: COLORS.neutral[300], flex: 1, height: 45 }} />
        </MaskedView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  optionTile: {
    flex: 1,
    flexDirection: 'row',
  },
  optionTileContainer: {
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  inactiveContainerOverlay: {
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.neutral[100],
    position: 'absolute',
  },
  activeContainerOverlay: {
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.primary[700],
    position: 'absolute',
  },
});
