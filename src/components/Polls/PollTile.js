import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import COLORS, { RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Subtitle from '../typography/Subtitle';

export default function PollTile({
  style, item, onPress, isActive, height = 45, data, /* activeMembers, */
}) {
  const color = isActive ? COLORS.shades[0] : COLORS.neutral[500];

  let countedVotes = 0;
  const getPercentage = () => {
    for (let i = 0; i < data.options.length; i += 1) {
      countedVotes += data.options[i].votes.length;
    }
    return countedVotes === 0 ? 0 : ((item.votes.length / countedVotes) * 100).toFixed(1);
  };
  const percentage = getPercentage();

  return (
    <Pressable
      activeOpacity={0.9}
      onPress={() => {
        onPress();
        ReactNativeHapticFeedback.trigger('impactHeavy', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: true,
        });
      }}
      style={style}
    >
      <View style={[styles.optionTileContainer, { height }]}>
        <View style={[isActive ? styles.activeContainerOverlay : styles.inactiveContainerOverlay, { width: `${percentage}%`, height }]} />
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
                <Subtitle
                  type={1}
                  color={COLORS.neutral[500]}
                  text={item.option}
                />
                <Subtitle
                  type={1}
                  style={{ fontWeight: '400' }}
                  color={COLORS.neutral[500]}
                  text={`${item.votes.length} ${i18n.t('votes')}`}
                />
              </View>
            </View>
              )}
        >
          <View style={{ backgroundColor: color, width: `${percentage}%`, height: 45 }} />
          <View style={{ backgroundColor: COLORS.neutral[300], flex: 1, height: 45 }} />
        </MaskedView>
      </View>
      {/* <View style={{
        position: 'absolute', right: 10, top: 11, flexDirection: 'row',
      }}
      >
        {item.votes && item.votes.map((user) => <Avatar style={{ marginLeft: -10 }} size={25} data={activeMembers.find((member) => member.id === user)} />)}
      </View> */}
    </Pressable>
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
