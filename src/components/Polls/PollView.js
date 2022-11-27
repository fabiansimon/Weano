import { FlatList, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import PollTile from './PollTile';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';

export default function PollView({
  style, data, title, subtitle,
}) {
  const [voteIndex, setVoteIndex] = useState(-1);
  const [optionsData, setOptionsData] = useState([]);

  useEffect(() => {
    setOptionsData(data);
  }, [data]);

  const handleVote = (index) => {
    setOptionsData((prev) => {
      const newArr = prev;
      if (voteIndex === index) {
        newArr[index].votes -= 1;
        setVoteIndex(-1);
        return newArr;
      }
      if (voteIndex !== -1) {
        newArr[voteIndex].votes -= 1;
      }
      newArr[index].votes += 1;
      setVoteIndex(index);
      return newArr;
    });
  };

  const getPercentage = (votes) => {
    let countedVotes = 0;
    for (let i = 0; i < data.length; i += 1) {
      countedVotes += data[i].votes;
    }
    return countedVotes === 0 ? 0 : ((votes / countedVotes) * 100).toFixed(1);
  };

  const header = data ? title : i18n.t('Be the first one to add one!');

  return (
    <View style={style}>
      <Headline
        type={3}
        text={header}
      />
      <Body
        type={1}
        text={subtitle}
        color={COLORS.neutral[300]}
        style={{ marginBottom: 16 }}
      />
      <FlatList
        data={optionsData}
        renderItem={({ item, index }) => (
          <PollTile
            style={{ marginBottom: 16 }}
            data={item}
            index={index}
            onPress={() => handleVote(index)}
            isActive={voteIndex === index}
            percentage={`${getPercentage(item.votes)}%`}
          />
        )}
      />
    </View>
  );
}
