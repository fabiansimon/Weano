import {
  Dimensions, StyleSheet, Text, View,
} from 'react-native';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import COLORS, { PADDING, RADIUS } from '../../../constants/Theme';
import Body from '../../typography/Body';
import Divider from '../../Divider';
import Headline from '../../typography/Headline';
import i18n from '../../../utils/i18n';

export default function ChatPollBubble({ style, data, sender }) {
  const getPercentage = (votes) => {
    let countedVotes = 0;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.options.length; i++) {
      countedVotes += data.options[i].votes;
    }

    return (votes / countedVotes) * 100;
  };

  const getListItem = (option, isActive) => {
    const percentage = getPercentage(option.votes);
    const width = `${percentage}%`;

    const color = isActive ? COLORS.shades[0] : COLORS.neutral[500];

    return (
      <View style={{ marginTop: 14 }}>
        <View style={styles.optionTileContainer}>
          <View style={[isActive ? styles.activeContainerOverlay : styles.inactiveContainerOverlay, { width }]} />
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
                  <Headline type={4} color={COLORS.neutral[500]} text={option.string} />
                  <Headline type={4} color={COLORS.neutral[500]} text={`${percentage}%`} />
                </View>
              </View>
              )}
          >
            <View style={{ backgroundColor: color, width, height: 45 }} />
            <View style={{ backgroundColor: COLORS.neutral[300], flex: 1, height: 45 }} />
          </MaskedView>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Body
        type={2}
        text={`${sender} added an poll 📊`}
        color={COLORS.neutral[300]}
        style={{ marginVertical: 8 }}
      />
      <Divider omitPadding />
      <Headline
        style={{ marginTop: 12, marginBottom: -4 }}
        type={3}
        text={data.title}
      />
      <View style={{ marginTop: 4, marginBottom: 12 }}>
        {data.options.map((option, index) => getListItem(option, index === 2))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingHorizontal: PADDING.m,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    paddingBottom: 10,
    width: Dimensions.get('window').width * 0.7,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
  },
  optionTile: {
    flex: 1,
    flexDirection: 'row',
  },
  optionTileContainer: {
    height: 45,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    // paddingHorizontal: 14,
  },
  inactiveContainerOverlay: {
    height: 45,
    borderTopLeftRadius: RADIUS.m,
    borderBottomLeftRadius: RADIUS.m,
    backgroundColor: COLORS.neutral[100],
    position: 'absolute',
  },
  activeContainerOverlay: {
    height: 45,
    borderTopLeftRadius: RADIUS.m,
    borderBottomLeftRadius: RADIUS.m,
    backgroundColor: COLORS.primary[700],
    position: 'absolute',
  },
});
