import { Alert, StyleSheet, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';
import i18n from '../../utils/i18n';
import Divider from '../Divider';
import Headline from '../typography/Headline';
import Utils from '../../utils';

export default function AvailabilityTile({ style, dateRange, isAvailable = true }) {
  const dateString = `${Utils.getDateFromTimestamp(dateRange.startDate, 'DD.MM')} - ${Utils.getDateFromTimestamp(dateRange.endDate, 'DD.MM')}`;

  const showAlert = () => Alert.alert(
    i18n.t('Are you sure?'),
    `${i18n.t('To delete following')} ${isAvailable ? i18n.t('availability') : i18n.t('unavailability')}:\n ${dateString}`,
    [
      {
        text: i18n.t("I'm sure"),
        // onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: i18n.t('Cancel'),
        // onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
    ],
  );
  return (
    <View style={[styles.container, style]}>
      <Body
        style={{ marginTop: 10, marginLeft: 15 }}
        color={COLORS.neutral[500]}
        type={2}
        text={isAvailable ? i18n.t('available from - to') : i18n.t('unavailable from - to')}
      />
      <Divider />
      <View style={styles.bottomContainer}>
        <Headline
          type={3}
          text={dateString}
        />
        <Icon
          name="trash"
          suppressHighlighting
          onPress={() => showAlert()}
          size={28}
          color={COLORS.neutral[300]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  bottomContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
});
