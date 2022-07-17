import { View } from 'react-native';
import React, { useState } from 'react';
import PollTile from './PollTile';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Button from '../Button';

export default function PollView({
  style, data, title, subtitle,
}) {
  const [voteIndex, setVoteIndex] = useState(-1);

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
        color={COLORS.neutral[500]}
        style={{ marginBottom: 30 }}
      />
      {data && data.map((item, index) => (
        <PollTile
          style={{ marginBottom: 12 }}
          data={item}
          index={index}
          onPress={() => setVoteIndex(index === voteIndex ? -1 : index)}
          isActive={voteIndex === index}
        />
      ))}
      {data && (
      <Button
        text={i18n.t('Vote')}
        style={{ marginTop: 10 }}
        fullWidth={false}
        onPress={() => console.log('Add Vote')}
        isDisabled={voteIndex === -1}
      />
      )}
    </View>
  );
}
