import {
  View, StyleSheet, Modal,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import PagerView from 'react-native-pager-view';
import CalendarPicker from 'react-native-calendar-picker';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';
import TextField from './TextField';
import Body from './typography/Body';
import Button from './Button';
import KeyboardView from './KeyboardView';
import Chip from './Chip';
import PopUpModal from './PopUpModal';
import Utils from '../utils';

export default function CreateModal({ isVisible, onRequestClose }) {
  const [phoneNr, setPhoneNr] = useState('');
  const [name, setSame] = useState(false);
  const [location, setLocation] = useState(false);
  const [dateRange, setDateRange] = useState({
    selectedStartDate: null,
    selectedEndDate: null,
  });
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pageRef = useRef(null);

  const currentInvitees = [
    {
      name: 'Jonathan',
    },
    {
      name: 'Alex',
    },
    {
      name: 'Julia',
    },
    {
      name: 'Matthias M.',
    },
  ];

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setDateRange((prev) => ({
        ...prev,
        selectedEndDate: date,
      }));
    } else {
      setDateRange(() => ({
        selectedStartDate: date,
        selectedEndDate: null,
      }));
    }
  };

  const datePlaceholder = () => {
    const startDate = dateRange.selectedStartDate && Utils.getDateFromTimestamp(dateRange.selectedStartDate);
    const endDate = dateRange.selectedEndDate && Utils.getDateFromTimestamp(dateRange.selectedEndDate, 'MMM Do YY');

    return `${startDate} - ${endDate}`;
  };

  const handleChange = () => {
    pageRef.current?.setPage(pageIndex + 1);
    setPageIndex(pageIndex + 1);
  };

  const getTitleView = () => (
    <View>
      <Headline
        type={4}
        text={i18n.t('Let’s start this right 🌍')}
        color={COLORS.neutral[700]}
        style={{ marginTop: 6 }}
      />
      <Headline
        type={4}
        text={i18n.t('What do you want to name it')}
        color={COLORS.neutral[700]}
        style={{ marginTop: 45 }}
      />
      <TextField
        keyboardType="phone-pad"
        style={{ marginTop: 18, marginBottom: 10 }}
        value={phoneNr || null}
        onChangeText={(val) => setPhoneNr(val)}
        placeholder={i18n.t('Epic Summer Trip 2021 ✈️')}
        onDelete={() => setPhoneNr('')}
      />
      <Body
        type={2}
        text={i18n.t("don't worry, it can be edited later")}
        color={COLORS.neutral[500]}
      />
    </View>
  );

  const getInviteView = () => (
    <View>
      <Headline
        type={4}
        text={i18n.t('Right tribe - right vibe 🎉')}
        color={COLORS.neutral[700]}
        style={{ marginTop: 6 }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Headline
          type={4}
          text={i18n.t('Let’s invite some people')}
          color={COLORS.neutral[700]}
          style={{ marginTop: 45 }}
        />
        <Headline
          type={4}
          text={i18n.t('Add more')}
          color={COLORS.primary[700]}
          style={{ marginTop: 45, textDecorationLine: 'underline' }}
        />
      </View>
      <View style={styles.wrapContainer}>
        {currentInvitees.map((invitee) => (
          <Chip
            style={{ marginBottom: 10, marginRight: 10 }}
            string={invitee.name}
            onDelete={() => console.log(`delete: ${invitee.name}`)}
          />
        ))}
      </View>
    </View>
  );

  const getDateView = () => (
    <View>
      <Headline
        type={4}
        text={i18n.t('Already know the date? 🎉')}
        color={COLORS.neutral[700]}
        style={{ marginTop: 6 }}
      />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 45,
      }}
      >
        <Headline
          type={4}
          text={i18n.t('You can always come back later')}
          color={COLORS.neutral[700]}
        />
        <Icon
          name="infocirlce"
          size={20}
          color={COLORS.neutral[500]}
          onPress={() => setPopUpVisible(true)}
          suppressHighlighting
        />
      </View>
      <TextField
        onPress={() => setCalendarVisible(true)}
        focusable={false}
        disabled
        style={{ marginTop: 18, marginBottom: 10 }}
        value={dateRange || null}
        icon="calendar"
        placeholder={datePlaceholder()}
      />
      <Body
        type={2}
        text={i18n.t("don't worry, it can be edited later")}
        color={COLORS.neutral[500]}
      />
      <PopUpModal
        isVisible={calendarVisible}
        title={i18n.t('Select dates')}
        subtitle={i18n.t('Nothing is set in stone. No worries')}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View>
          <View style={{ marginTop: 30 }}>
            <CalendarPicker
              onDateChange={(date, type) => onDateChange(date, type)}
              dayLabelsWrapper={{ borderColor: 'transparent' }}
              width={350}
              allowRangeSelection
              todayBackgroundColor={COLORS.neutral[300]}
              selectedDayColor={COLORS.secondary[700]}
              selectedDayTextColor={COLORS.shades[0]}
              previousComponent={<Icon name="arrowleft" size={22} />}
              nextComponent={<Icon name="arrowright" size={22} />}
            />
            <Button
              text={i18n.t('Confirm')}
              style={{ marginTop: 40 }}
              fullWidth={false}
              onPress={() => setCalendarVisible(false)}
              isDisabled={false}
            />
          </View>
        </View>
      </PopUpModal>
      <PopUpModal
        isVisible={popUpVisible}
        title={i18n.t('No rush!')}
        subtitle={i18n.t("You don't need to add the Date yet. You can always come back and change the date whenever you need to. 👍🏽")}
        onRequestClose={() => setPopUpVisible(false)}
      />
    </View>
  );

  const getLocationView = () => (
    <View>
      <Headline
        type={4}
        text={i18n.t('Already know  the destination? 🎉')}
        color={COLORS.neutral[700]}
        style={{ marginTop: 6 }}
      />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 45,
      }}
      >
        <Headline
          type={4}
          text={i18n.t('You can always change it later')}
          color={COLORS.neutral[700]}
        />
        <Icon
          name="infocirlce"
          size={20}
          color={COLORS.neutral[500]}
          onPress={() => setPopUpVisible(true)}
          suppressHighlighting
        />
      </View>
      <TextField
        style={{ marginTop: 18, marginBottom: 10 }}
        value={phoneNr || null}
        onChangeText={(val) => setPhoneNr(val)}
        placeholder={i18n.t('Paris, France 🇫🇷')}
        onDelete={() => setPhoneNr('')}
      />
      <PopUpModal
        isVisible={popUpVisible}
        title={i18n.t('No rush!')}
        subtitle={i18n.t("You don't need to add the Location yet. You can always come back and change the date whenever you need to. 👍🏽")}
        onRequestClose={() => setPopUpVisible(false)}
      />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={onRequestClose}
      presentationStyle="pageSheet"
    >
      <KeyboardView>
        <View style={styles.container}>
          <Headline
            type={2}
            text={i18n.t('Start Adventure')}
            color={COLORS.shades[100]}
          />
          <PagerView
            style={{ flex: 1 }}
            ref={pageRef}
            scrollEnabled
          >
            {getTitleView()}
            {getInviteView()}
            {getDateView()}
            {getLocationView()}
          </PagerView>
          {/* <PageIndicator /> */}
          <Button
            text={i18n.t('Continue')}
            onPress={() => handleChange()}
          />
        </View>
      </KeyboardView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    padding: 25,
  },
  wrapContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
