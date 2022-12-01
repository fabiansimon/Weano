import {
  View, StyleSheet, Modal,
} from 'react-native';
import React, {
  useRef, useState, useEffect,
} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import PagerView from 'react-native-pager-view';
import Contacts from 'react-native-contacts';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';
import TextField from './TextField';
import Button from './Button';
import KeyboardView from './KeyboardView';
import ContactChip from './ContactChip';
import PopUpModal from './PopUpModal';
import Utils from '../utils';
import PageIndicator from './PageIndicator';
import BackButton from './BackButton';
import ADD_TRIP from '../mutations/addTrip';
import CalendarModal from './CalendarModal';
import ContactsModal from './ContactsModal';
import Body from './typography/Body';

export default function CreateModal({ isVisible, onRequestClose }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  });
  const [addTrip, { loading, error }] = useMutation(ADD_TRIP);

  const [location, setLocation] = useState({
    placeName: '',
    latlon: [],
  });
  const [tripName, setTripName] = useState([]);

  // MODALS
  const [contactsVisible, setContactsVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pageRef = useRef(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = () => {
    setContacts([]);

    Contacts.getAll().then((c) => {
      c.forEach((contact) => {
        setContacts((prev) => [...prev, {
          ...contact,
          isInvited: false,
        }]);
      });
    });
  };

  const handleInvite = (index) => {
    setContacts((prev) => {
      // eslint-disable-next-line no-param-reassign
      prev[index].isInvited = !prev[index].isInvited;
      return [...prev];
    });
  };
  const handleDeselection = (invitee) => {
    setContacts((prev) => {
      const index = prev.findIndex((item) => item.recordID === invitee.recordID);

      // eslint-disable-next-line no-param-reassign
      prev[index].isInvited = false;
      return [...prev];
    });
  };

  const getDateValue = () => {
    let start = '--';
    let end = '--';
    start = startDate && Utils.getDateFromTimestamp(startDate, 'MMM Do');
    end = endDate && Utils.getDateFromTimestamp(endDate, 'MMM Do YY');

    return `${start} - ${end}`;
  };

  const handleChange = (isBack) => {
    if (pageIndex === 0 && isBack) return;
    if (pageIndex === createData.length - 1 && !isBack) {
      handleData();
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

  const handleData = async () => {
    const invitees = [];
    const invited = contacts?.filter((item) => item.isInvited);

    invited.forEach((invitee) => {
      invitees.push({
        fullName: `${invitee.givenName} ${invitee.familyName}`,
        phoneNumber: invitee.phoneNumbers[0].number,
        status: 'PENDING',
      });
    });

    const { placeName, latlon } = location;

    await addTrip({
      variables: {
        trip: {
          dateRange: {
            endDate,
            startDate,
          },
          invitees,
          location: {
            placeName,
            latlon,
          },
          title: tripName,
        },
      },
    }).catch((e) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      console.log(`ERROR: ${e.message}`);
    });

    setTripName('');
    setLocation({
      string: '',
      latlon: [],
    });
    setStartDate();
    setEndDate();
    setContacts();
    onRequestClose();
    setPageIndex(0);
  };

  const getDateContent = () => (
    <View>
      <TextField
        onPress={() => setCalendarVisible(true)}
        onPrefixPress={() => setCalendarVisible(true)}
        focusable={false}
        disabled
        style={{ marginTop: 18, marginBottom: 10 }}
        value={getDateValue()}
        icon="calendar"
        placeholder={i18n.t('Select a date')}
      />
      <CalendarModal
        isVisible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
        minimumDate={new Date()}
        initialStartDate={startDate}
        initialEndDate={endDate}
        onApplyClick={(startData, endData) => {
          if (startData != null && endData != null) {
            setStartDate(Date.parse(startData) / 1000);
            setEndDate(Date.parse(endData) / 1000);
          }
        }}
      />
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
        value={location.placeName || null}
        onChangeText={(val) => setLocation({
          placeName: val,
          latlon: [],
        })}
        placeholder={i18n.t('Paris, France 🇫🇷')}
        onDelete={() => setLocation({
          placeName: '',
          latlon: [],
        })}
        geoMatching
        onSuggestionPress={(sugg) => setLocation({
          placeName: sugg.string,
          latlon: sugg.location,
        })}
      />

      <PopUpModal
        isVisible={popUpVisible}
        title={i18n.t('No rush!')}
        subtitle={i18n.t("You don't need to add the Location yet. You can always come back and change the date whenever you need to. 👍🏽")}
        onRequestClose={() => setPopUpVisible(false)}
      />
    </View>
  );

  const getInviteContent = () => {
    const invitees = contacts?.filter((item) => item.isInvited);

    return (
      <View style={styles.wrapContainer}>
        {!invitees || invitees?.length < 1 ? (
          <Body
            type={2}
            style={{ textAlign: 'center', flex: 1 }}
            color={COLORS.neutral[300]}
            text={i18n.t('No one invited yet, Start inviting people!')}
          />
        ) : invitees.map((invitee) => (
          <ContactChip
            key={invitee.givenName}
            style={{ marginBottom: 10, marginRight: 10 }}
            string={`${invitee.givenName} ${invitee.familyName}`}
            onDelete={() => handleDeselection(invitee)}
          />
        ))}
      </View>
    );
  };

  const getTitleContent = () => (
    <TextField
      style={{ marginTop: 18, marginBottom: 10 }}
      value={tripName || null}
      onChangeText={(val) => setTripName(val)}
      placeholder={i18n.t('Epic Summer Trip 2021 ✈️')}
      onDelete={() => setTripName('')}
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
        name="info-with-circle"
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
        name="info-with-circle"
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
    <View style={{ paddingHorizontal: 20 }}>
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
      <KeyboardView paddingBottom={40}>
        <View style={styles.container}>
          <Headline
            type={2}
            text={i18n.t('Start Adventure')}
            style={{ paddingHorizontal: 20 }}
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
              isLoading={loading}
              text={i18n.t('Continue')}
              onPress={() => handleChange()}
            />
          </View>
        </View>
      </KeyboardView>
      <ContactsModal
        isVisible={contactsVisible}
        onRequestClose={() => setContactsVisible(false)}
        data={contacts}
        onPress={(index) => handleInvite(index)}
      />
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
