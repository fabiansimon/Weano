import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import Headline from '../typography/Headline';
import COLORS, { RADIUS } from '../../constants/Theme';
import Avatar from '../Avatar';
import userManagement from '../../utils/userManagement';
import Body from '../typography/Body';

export default function PollTile({
  style, item, onPress, isActive, height = 45, data,
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
      onPress={onPress}
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
                <Body
                  type={1}
                  color={COLORS.neutral[500]}
                  text={item.option}
                />
                <Body
                  type={1}
                  style={{ marginRight: item.votes.length * 23 }}
                  color={COLORS.neutral[500]}
                  text={`${percentage}%`}
                />
              </View>
            </View>
              )}
        >
          <View style={{ backgroundColor: color, width: `${percentage}%`, height: 45 }} />
          <View style={{ backgroundColor: COLORS.neutral[300], flex: 1, height: 45 }} />
        </MaskedView>
        <View style={{
          position: 'absolute', right: 10, top: 11, flexDirection: 'row',
        }}
        >
          {item.votes.map((user) => <Avatar style={{ marginLeft: -10 }} size={25} data={userManagement.convertIdToUser(user)} />)}
        </View>
      </View>
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
    backgroundColor: COLORS.primary[300],
    position: 'absolute',
  },
});
