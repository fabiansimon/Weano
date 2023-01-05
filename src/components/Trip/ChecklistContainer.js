import { View } from 'react-native';
import React, { useState } from 'react';
import TripListContainer from './TripListContainer';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Divider from '../Divider';
import Switch from '../Switch';
import CheckboxTile from './CheckboxTile';
import activeTripStore from '../../stores/ActiveTripStore';
import Body from '../typography/Body';
import COLORS from '../../constants/Theme';

export default function ChecklistContainer({
  onPress, onLayout, sender,
}) {
  const { mutualTasks, privateTasks } = activeTripStore((state) => state.activeTrip);
  const [isPrivate, setIsPrivate] = useState(false);

  const ChecklistItem = ({ item }) => (
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
          type={4}
          style={{ alignSelf: 'center' }}
          text={isPrivate ? i18n.t('Private list') : i18n.t('Mutual list')}
        />
        {!sender && <Switch bool={isPrivate} onPress={() => setIsPrivate(!isPrivate)} />}
      </View>
      <Divider top={12} />
      {isPrivate ? privateTasks?.length > 0
        ? privateTasks?.map((item) => <ChecklistItem item={item} />)
        : (
          <Body
            color={COLORS.neutral[300]}
            type={1}
            text={i18n.t('No private tasks yet')}
            style={{ alignSelf: 'center' }}
          />
        ) : mutualTasks?.length > 0
        ? mutualTasks?.map((item) => <ChecklistItem item={item} />)
        : (
          <Body
            color={COLORS.neutral[300]}
            type={1}
            text={i18n.t('No mutual tasks yet')}
            style={{ alignSelf: 'center' }}
          />
        )}
    </TripListContainer>
  );
}
