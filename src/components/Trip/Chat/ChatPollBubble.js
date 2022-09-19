import {
  Dimensions, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import COLORS, { PADDING, RADIUS } from '../../../constants/Theme';
import Body from '../../typography/Body';
import Divider from '../../Divider';
import Headline from '../../typography/Headline';

export default function ChatPollBubble({
  style, data, sender, onPress,
}) {
  const [optionsData, setOptionsData] = useState([]);
  const [votedIndex, setVotedIndex] = useState(-1);

  useEffect(() => {
    setOptionsData(data.options);
  }, []);

  const getPercentage = (votes) => {
    let countedVotes = 0;
    for (let i = 0; i < data.options.length; i += 1) {
      countedVotes += data.options[i].votes;
    }
    return countedVotes === 0 ? 0 : ((votes / countedVotes) * 100).toFixed(1);
  };

  const handleVote = (index) => {
    setOptionsData((prev) => {
      const newArr = prev;
      if (votedIndex === index) {
        newArr[index].votes -= 1;
        setVotedIndex(-1);
        return newArr;
      }

      if (votedIndex !== -1) {
        newArr[votedIndex].votes -= 1;
      }
      newArr[index].votes += 1;
      setVotedIndex(index);
      return newArr;
    });
  };

  const getListItem = (option, index) => {
    const percentage = getPercentage(option.votes);
    const width = `${percentage}%`;

    const isActive = votedIndex === index;

    const color = isActive ? COLORS.shades[0] : COLORS.neutral[500];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleVote(index)}
        style={{ marginTop: 14 }}
      >
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
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.container, style]}
    >
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
        {optionsData && optionsData.map((option, index) => getListItem(option, index))}
      </View>
    </TouchableOpacity>
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
  },
  inactiveContainerOverlay: {
    height: 45,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.neutral[100],
    position: 'absolute',
  },
  activeContainerOverlay: {
    height: 45,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.primary[700],
    position: 'absolute',
  },
});
