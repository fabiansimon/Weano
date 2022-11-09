import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import i18n from '../utils/i18n';
import Button from './Button';
import CalendarPicker from './CalendarPicker';
import Divider from './Divider';
import Body from './typography/Body';
import Headline from './typography/Headline';

const HALF_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarModal = ({
  isVisible,
  onRequestClose,
  minimumDate,
  initialStartDate,
  initialEndDate,
  onApplyClick,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const formattedDate = (date) => (date
    ? `${WEEKS[date?.getDay()]}, ${String(date.getDate()).padStart(2, '0')} ${
      HALF_MONTHS[date.getMonth()]
    }`
    : '--/--');

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={onRequestClose}
      >
        <SafeAreaView style={styles.containerStyle}>
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {}}>
            <View
              style={{
                backgroundColor: COLORS.shades[0], borderRadius: RADIUS.l, margin: PADDING.l, overflow: 'hidden',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.timelineContainerStyle}>
                  <Body
                    color={COLORS.neutral[300]}
                    type={2}
                    text={i18n.t('From')}
                  />
                  <Headline
                    color={COLORS.shades[100]}
                    type={4}
                    text={formattedDate(startDate)}
                  />
                </View>
                <View style={styles.verticleDivider} />
                <View style={styles.timelineContainerStyle}>
                  <Body
                    color={COLORS.neutral[300]}
                    type={2}
                    text={i18n.t('To')}
                  />
                  <Headline
                    color={COLORS.shades[100]}
                    type={4}
                    text={formattedDate(endDate)}
                  />
                </View>
              </View>
              <Divider omitPadding />

              <CalendarPicker
                minDate={minimumDate}
                startDate={startDate}
                endDate={endDate}
                startEndDateChange={(startDateData, endDateData) => {
                  setStartDate(startDateData);
                  setEndDate(endDateData);
                }}
              />
              <View style={styles.applyBtn}>
                <Button
                  onPress={() => {
                    onApplyClick(startDate, endDate);
                    onRequestClose();
                  }}
                  text={i18n.t('Apply')}
                />
              </View>

            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  timelineContainerStyle: {
    overflow: 'hidden',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticleDivider: {
    height: 74,
    width: 1,
    backgroundColor: COLORS.neutral[100],
  },
  applyBtn: {
    height: 50,
    marginTop: PADDING.l,
    marginBottom: PADDING.s,
    marginHorizontal: PADDING.s,
  },
});

export default CalendarModal;
