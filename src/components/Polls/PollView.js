import {
  FlatList, Pressable, StyleSheet, View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PollTile from './PollTile';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';

export default function PollView({
  style, data, title, subtitle, onPress,
}) {
  const [voteIndex, setVoteIndex] = useState(-1);
  const [pollData, setPollData] = useState([]);

  useEffect(() => {
    setPollData(data);
  }, [data]);

  const handleVote = (index) => {
    // console.log(index);
  };

  const getPercentage = (votes) => {
    let countedVotes = 0;
    for (let i = 0; i < pollData.options.length; i += 1) {
      countedVotes += pollData.options[i].votes.length;
    }
    return countedVotes === 0 ? 0 : ((votes / countedVotes) * 100).toFixed(1);
  };

  const header = data ? title : i18n.t('Be the first one to add one!');

  return (
    <View style={[styles.pollContainer, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Headline
            type={4}
            text={header}
          />
          <Body
            type={2}
            text={subtitle}
            color={COLORS.neutral[300]}
            style={{ marginBottom: 16, marginTop: 2 }}
          />
        </View>
        {onPress && (
        <Pressable
          onPress={onPress}
          style={styles.addIcon}
        >
          <Icon
            name="more-vertical"
            size={20}
            color={COLORS.neutral[700]}
          />
        </Pressable>
        )}
      </View>
      <FlatList
        data={pollData.options}
        renderItem={({ item, index }) => (
          <PollTile
            style={{ marginBottom: 16 }}
            data={item}
            index={index}
            onPress={() => handleVote(index)}
            isActive={voteIndex === index}
            percentage={`${getPercentage(item.votes.length)}%`}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    borderRadius: 100,
    backgroundColor: COLORS.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    height: 35,
    width: 35,
  },
  pollContainer: {
    paddingVertical: 20,
    paddingHorizontal: PADDING.s,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
});
