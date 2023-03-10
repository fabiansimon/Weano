import { Pressable, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import i18n from '../../utils/i18n';
import Switch from '../Switch';
import CheckboxTile from './CheckboxTile';
import activeTripStore from '../../stores/ActiveTripStore';
import Body from '../typography/Body';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import EmptyDataContainer from '../EmptyDataContainer';
import ROUTES from '../../constants/Routes';

export default function ChecklistContainer({
  onPress, onLayout, sender,
}) {
  // STORES
  const { mutualTasks, privateTasks } = activeTripStore((state) => state.activeTrip);

  // STATE & MISC
  const [isPrivate, setIsPrivate] = useState(privateTasks?.length > mutualTasks?.length);

  if (mutualTasks?.length <= 0 && privateTasks?.length <= 0) {
    return (
      <EmptyDataContainer
        style={{ marginTop: -6, marginHorizontal: -4 }}
        title={i18n.t('There are no tasks to show yet.')}
        subtitle={i18n.t('Be the first one to add one.')}
        route={ROUTES.checklistScreen}
      />
    );
  }

  const getChecklistItem = (item) => (
    <View
      onLayout={onLayout}
      style={{
        marginHorizontal: PADDING.m,
        marginVertical: -4,
      }}
    >
      <CheckboxTile
        isDense={item.isPrivate}
        disabled
        disableLabel={isPrivate}
        item={item}
      />
    </View>
  );

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginBottom: 6,
      }}
      >
        <Body
          type={1}
          style={{ alignSelf: 'center', fontWeight: '500' }}
          text={isPrivate ? i18n.t('Private list') : i18n.t('Mutual list')}
        />
        {!sender && <Switch bool={isPrivate} onPress={() => setIsPrivate(!isPrivate)} />}
      </View>
      {isPrivate ? privateTasks?.length > 0
        ? privateTasks?.map((item) => getChecklistItem(item))
        : (
          <Body
            color={COLORS.neutral[300]}
            type={2}
            text={i18n.t('No private tasks yet')}
            style={{ marginLeft: PADDING.m }}
          />
        ) : mutualTasks?.length > 0
        ? mutualTasks?.map((item) => getChecklistItem(item))
        : (
          <Body
            color={COLORS.neutral[300]}
            type={2}
            style={{ marginLeft: PADDING.m }}
            text={i18n.t('No mutual tasks yet')}
          />
        )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    marginHorizontal: -5,
    paddingVertical: 10,
    paddingBottom: 14,
  },
});
