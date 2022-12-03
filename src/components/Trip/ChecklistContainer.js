import { View } from 'react-native';
import React, { useState } from 'react';
import TripListContainer from './TripListContainer';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Divider from '../Divider';
import Switch from '../Switch';
import CheckboxTile from './CheckboxTile';
import activeTripStore from '../../stores/ActiveTripStore';

export default function ChecklistContainer({
  onPress, onLayout, sender,
}) {
  const { mutualTasks, privateTasks } = activeTripStore((state) => state.activeTrip);
  const [isPrivate, setIsPrivate] = useState(false);

  const getChecklistItem = (item) => (
    <View
      onLayout={onLayout}
      style={{
        marginVertical: 10,
        marginHorizontal: 25,
      }}
    >
      <CheckboxTile
        disabled
        disableLabel={isPrivate}
        item={item}
      />
    </View>
  );

  return (
    <TripListContainer
      onPress={onPress}
    >
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
      {isPrivate ? privateTasks && privateTasks.map((item) => getChecklistItem(item))
        : mutualTasks && mutualTasks.map((item) => getChecklistItem(item))}
    </TripListContainer>
  );
}
