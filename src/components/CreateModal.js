import {
  View, StyleSheet, Modal, Keyboard,
} from 'react-native';
import React, {
  useRef, useState, useEffect,
} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import PagerView from 'react-native-pager-view';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { CalendarList } from 'react-native-calendars';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS, { PADDING } from '../constants/Theme';
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
import Body from './typography/Body';
import tripsStore from '../stores/TripsStore';
import InputModal from './InputModal';
import httpService from '../utils/httpService';
import userStore from '../stores/UserStore';
import toastConfig from '../constants/ToastConfig';

export default function CreateModal({ isVisible, onRequestClose }) {
  // MUTATIONS
  const [addTrip, { loading, error }] = useMutation(ADD_TRIP);

  // STORES
  const addTripState = tripsStore((state) => state.addTrip);
  const {
    avatarUri, firstName, lastName, id: userId,
  } = userStore((state) => state.user);

  // STATE & MISC
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState({
    placeName: '',
    latlon: [],
  });
  const [tripName, setTripName] = useState('');
  // MODALS
  const [inputVisible, setInputVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pageRef = useRef(null);
  const [invitees, setInvitees] = useState([]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
    }
  }, [error]);

  const getDateValue = () => {
    if (!startDate || !endDate) {
      return;
    }

    const start = startDate && Utils.getDateFromTimestamp(startDate, 'Do MMM YYYY');
    const end = endDate && Utils.getDateFromTimestamp(endDate, 'Do MMM YYYY');

    return `${start} - ${end}`;
  };

  const handleChange = (isBack) => {
    if (pageIndex === 0 && isBack) return;
    if (pageIndex === createData.length - 1 && !isBack) {
      handleData();
      return;
    }

    let index;
    if (isBack) {
      index = pageIndex - 1;
    } else {
      index = pageIndex + 1;
    }
    navigatePage(index);
  };

  const navigatePage = (index) => {
    Keyboard.dismiss();

    setTimeout(() => {
      pageRef.current?.setPage(index);
      setPageIndex(index);
    }, 100);
  };

  const cleanData = () => {
    setTripName('');
    setLocation({
      string: '',
      latlon: [],
    });
    setStartDate();
    setEndDate();
    setInvitees([]);
    onRequestClose();
    setPageIndex(0);
  };

  const checkInputs = () => {
    if (tripName.trim().length <= 0) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: i18n.t('Make sure to enter a trip name first'),
      });
      return navigatePage(0);
    }
    if (!startDate && !endDate) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: i18n.t('Make sure to enter some dates. You can always come back later'),
      });
      return navigatePage(2);
    }
    if (location.placeName.trim() <= 0 || location.latlon.length <= 1) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: i18n.t('Make sure to enter a location. You can always come back later'),
      });
      return navigatePage(3);
    }

    return true;
  };

  const handleData = async () => {
    if (!checkInputs()) {
      return;
    }

    const { placeName, latlon } = location;
    const param = invitees.toString().replace(',', '&');

    await addTrip({
      variables: {
        trip: {
          dateRange: {
            endDate,
            startDate,
          },
          destination: {
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
    }).then((res) => {
      const id = res.data.createTrip;
      httpService.sendInvitations(param, id);
      addTripState({
        id,
        thumbnailUri: null,
        title: tripName,
        description: null,
        destinations: [{
          placeName,
          latlon,
        }],
        activeMembers: [{
          avatarUri,
          firstName,
          lastName,
          id: userId,
        }],
        dateRange: {
          endDate,
          startDate,
        },
        type: 'upcoming',
      });
    });

    cleanData();
  };

  const getDateContent = () => (
    <View>
      <TextField
        onPress={() => setCalendarVisible(true)}
        onPrefixPress={() => setCalendarVisible(true)}
        focusable={false}
        disabled
        style={{ marginTop: 10, marginBottom: 10 }}
        value={getDateValue()}
        icon="calendar"
        placeholder={i18n.t('Select a date')}
      />
      <CalendarModal
        onRequestClose={() => setCalendarVisible(false)}
        isVisible={calendarVisible}
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
        style={{ marginTop: 10, marginBottom: 10 }}
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

  const getInviteContent = () => (
    <View style={styles.wrapContainer}>
      {!invitees || invitees?.length < 1 ? (
        <Body
          type={2}
          style={{ flex: 1, maxWidth: '80%' }}
          color={COLORS.neutral[300]}
          text={i18n.t("Don't worry, you can also invite people once the trip is created 🤷‍♂️")}
        />
      ) : invitees.map((email, index) => (
        <ContactChip
          key={email}
          style={{ marginBottom: 10, marginRight: 10 }}
          string={email}
          onDelete={() => setInvitees((prev) => prev.filter((_, i) => index !== i))}
        />
      ))}
    </View>
  );

  const getTitleContent = () => (
    <TextField
      style={{ marginTop: 10, marginBottom: 10 }}
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
      trailing: <Body
        type={1}
        text={i18n.t('Add more')}
        color={COLORS.primary[700]}
        style={{ textDecorationLine: 'underline', fontWeight: '500' }}
        onPress={() => setInputVisible(true)}
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
      <Body
        type={1}
        text={item.title}
        color={COLORS.neutral[300]}
        style={{ marginTop: 2 }}
      />
      <View style={{
        flexDirection: 'row',
        justifyContent: item.trailing ? 'space-between' : 'flex-start',
        marginTop: 45,
      }}
      >
        <Body
          type={1}
          text={item.subtitle}
          color={COLORS.shades[100]}
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
      onRequestClose={() => {
        onRequestClose();
        cleanData();
      }}
      presentationStyle="pageSheet"
    >
      <KeyboardView
        behavior="padding"
        paddingBottom={40}
      >
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
            scrollEnabled={false}
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
              <BackButton
                style={{ height: 50, width: 50 }}
                onPress={() => handleChange(true)}
              />
            )}
            <Button
              isLoading={loading}
              text={i18n.t('Continue')}
              onPress={() => handleChange()}
            />
          </View>
        </View>
      </KeyboardView>
      <InputModal
        isVisible={inputVisible}
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize={false}
        emailInput
        multipleInputs
        placeholder={i18n.t('Invite friends')}
        onRequestClose={() => setInputVisible(false)}
        onPress={(input) => setInvitees((prev) => prev.concat(input))}
        autoClose
      />
      <Toast config={toastConfig} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: PADDING.l,
    marginBottom: 10,
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    paddingVertical: 25,
  },
  wrapContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
