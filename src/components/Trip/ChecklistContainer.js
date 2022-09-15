import { View } from 'react-native';
import React, { useState } from 'react';
import TripListContainer from './TripListContainer';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Divider from '../Divider';
import Switch from '../Switch';
import CheckboxTile from './CheckboxTile';

export default function ChecklistContainer({
  data, onPress, onLayout, sender,
}) {
  const [isPrivate, setIsPrivate] = useState(false);

  const getChecklistItem = (item, index, type) => (
    <View
      onLayout={onLayout}
      style={{
        marginVertical: 10,
        marginHorizontal: 25,
      }}
    >
      <CheckboxTile item={item} onPress={(isChecked) => onPress(isChecked, index, type)} />
    </View>
  );

  return (
    <TripListContainer>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
      }}
      >
        <Headline
          type={3}
          style={{ alignSelf: 'center' }}
          text={isPrivate ? i18n.t('Private list') : i18n.t('Mutual list')}
        />
        {!sender && <Switch bool={isPrivate} onPress={() => setIsPrivate(!isPrivate)} />}
      </View>
      <Divider top={12} />
      {isPrivate ? data.privateTasks && data.privateTasks.map((item, index) => getChecklistItem(item, index, 'PRIVATE'))
        : data.mutualTasks && data.mutualTasks.map((item, index) => getChecklistItem(item, index, 'MUTUAL'))}
    </TripListContainer>
  );
}
