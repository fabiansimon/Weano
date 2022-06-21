import {
  View, StyleSheet, Modal,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import PagerView from 'react-native-pager-view';
import CalendarPicker from 'react-native-calendar-picker';
import Contacts from 'react-native-contacts';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';
import TextField from './TextField';
import Button from './Button';
import KeyboardView from './KeyboardView';
import Chip from './Chip';
import PopUpModal from './PopUpModal';
import Utils from '../utils';
import PageIndicator from './PageIndicator';
import TitleModal from './TitleModal';
import ContactTile from './ContactTile';
import BackButton from './BackButton';

export default function CreateModal({ isVisible, onRequestClose }) {
  const [phoneNr, setPhoneNr] = useState('');
  const [title, setTitle] = useState(false);
  const [location, setLocation] = useState(false);
  const [dateRange, setDateRange] = useState({
    selectedStartDate: null,
    selectedEndDate: null,
  });
  const [contactsVisible, setContactsVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pageRef = useRef(null);

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = () => {
    Contacts.getAll().then((c) => {
      // BEST APPROACH? QUESTIONABLE

      // const currentContacts = [];
      // c.forEach((item) => {
      //   // eslint-disable-next-line no-param-reassign
      //   item.selectedNumber = '';
      //   currentContacts.push(item);
      // });

      setContacts(c);
    });
  };

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

  const handleChange = (isBack) => {
    if (pageIndex === 0 && isBack) return;
    if (pageIndex === createData.length - 1 && !isBack) {
      onRequestClose();
      setPageIndex(0);
      return;
    }

    if (isBack) {
      pageRef.current?.setPage(pageIndex - 1);
      setPageIndex(pageIndex - 1);
    } else {
      pageRef.current?.setPage(pageIndex + 1);
      setPageIndex(pageIndex + 1);
    }
  };

  const getDateContent = () => (
    <View>
      <TextField
        onPress={() => setCalendarVisible(true)}
        focusable={false}
        disabled
        style={{ marginTop: 18, marginBottom: 10 }}
        value={dateRange || null}
        icon="calendar"
        placeholder={datePlaceholder()}
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

  const getLocationContent = () => (
    <View>
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

  const getInviteContent = () => (
    <View style={styles.wrapContainer}>
      {currentInvitees.map((invitee) => (
        <Chip
          style={{ marginBottom: 10, marginRight: 10 }}
          string={invitee.name}
          onDelete={() => console.log(`delete: ${invitee.name}`)}
        />
      ))}
    </View>
  );

  const getTitleContent = () => (
    <TextField
      keyboardType="phone-pad"
      style={{ marginTop: 18, marginBottom: 10 }}
      value={phoneNr || null}
      onChangeText={(val) => setPhoneNr(val)}
      placeholder={i18n.t('Epic Summer Trip 2021 ✈️')}
      onDelete={() => setPhoneNr('')}
    />
  );

  const createData = [
    {
      title: i18n.t('Let’s start this right 🌍'),
      subtitle: i18n.t('What do you want to name it'),
      content: getTitleContent(),
      hint: i18n.t("don't worry, it can be edited later"),
    },
    {
      title: i18n.t('Right tribe - right vibe 🎉'),
      subtitle: i18n.t('Let’s invite some people'),
      trailing: <Headline
        type={4}
        text={i18n.t('Add more')}
        color={COLORS.primary[700]}
        style={{ textDecorationLine: 'underline' }}
        onPress={() => setContactsVisible(true)}
      />,
      content: getInviteContent(),
    },
    {
      title: i18n.t('Already know the date? 🎉'),
      subtitle: i18n.t('You can always come back later'),
      trailing: <Icon
        name="infocirlce"
        size={20}
        color={COLORS.neutral[500]}
        onPress={() => setPopUpVisible(true)}
        suppressHighlighting
      />,
      content: getDateContent(),
      hint: i18n.t("don't worry, it can be edited later"),
    },
    {
      title: i18n.t('Already know the destination? 🎉'),
      subtitle: i18n.t('You can always change it later'),
      trailing: <Icon
        name="infocirlce"
        size={20}
        color={COLORS.neutral[500]}
        onPress={() => setPopUpVisible(true)}
        suppressHighlighting
      />,
      content: getLocationContent(),
      hint: i18n.t("don't worry, it can be edited later"),
    },
  ];

  const getCreateView = (item) => (
    <View style={{ paddingHorizontal: 25 }}>
      <Headline
        type={4}
        text={item.title}
        color={COLORS.neutral[700]}
        style={{ marginTop: 6 }}
      />
      <View style={{
        flexDirection: 'row',
        justifyContent: item.trailing ? 'space-between' : 'flex-start',
        marginTop: 45,
      }}
      >
        <Headline
          type={4}
          text={item.subtitle}
          color={COLORS.neutral[700]}
        />
        {item.trailing}
      </View>
      {item.content}
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
            style={{ paddingHorizontal: 25 }}
            color={COLORS.shades[100]}
          />
          <PagerView
            style={{ flex: 1 }}
            ref={pageRef}
            scrollEnabled
          >
            {createData.map((item) => getCreateView(item))}
          </PagerView>
          <PageIndicator
            data={createData}
            pageIndex={pageIndex}
            style={{ alignSelf: 'center', marginBottom: 20 }}
          />
          <View style={styles.buttonContainer}>
            {pageIndex !== 0 && (
            <BackButton onPress={() => handleChange(true)} />
            )}
            <Button
              text={i18n.t('Continue')}
              onPress={() => handleChange()}
            />
          </View>
        </View>
      </KeyboardView>
      <TitleModal
        isVisible={contactsVisible}
        onRequestClose={() => setContactsVisible(false)}
        title={i18n.t('Add friends')}
      >
        {contacts.map((c) => <ContactTile contact={c} />)}
      </TitleModal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginBottom: 10,
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 25,
  },
  wrapContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
