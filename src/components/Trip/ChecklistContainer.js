import { View } from 'react-native';
import React, { useState } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import TripListContainer from './TripListContainer';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Divider from '../Divider';
import COLORS from '../../constants/Theme';
import Switch from '../Switch';
import Body from '../typography/Body';

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
      <BouncyCheckbox
        size={22}
        textComponent={(
          <View style={{ marginLeft: 8 }}>
            <View>
              {item.assignee && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon color={item.isDone ? COLORS.success[700] : COLORS.neutral[300]} name="person" />
                <Body
                  type={2}
                  text={item.assignee}
                  color={item.isDone ? COLORS.success[700] : COLORS.neutral[300]}
                  style={{ marginLeft: 4 }}
                />
              </View>
              )}
            </View>
            <Headline
              type={4}
              text={item.title}
              style={{ textDecorationLine: item.isDone ? 'line-through' : 'none' }}
              color={item.isDone ? COLORS.success[700] : COLORS.shades[100]}
            />
          </View>
        )}
        fillColor={COLORS.success[700]}
        accessibilityElementsHidden
        iconStyle={{
          borderRadius: 6,
          borderColor: COLORS.neutral[700],
        }}
        onPress={(isChecked) => onPress(isChecked, index, type)}
      />
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
