import {
  View,
  StyleSheet,
  Modal,
  Keyboard,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useRef, useState, useEffect, useCallback} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PagerView from 'react-native-pager-view';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
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
import TitleModal from './TitleModal';
import Subtitle from './typography/Subtitle';

export default function CreateModal({isVisible, onRequestClose}) {
  // MUTATIONS
  const [addTrip, {loading}] = useMutation(ADD_TRIP);

  // STORES
  const addTripState = tripsStore(state => state.addTrip);
  const {
    avatarUri,
    firstName,
    lastName,
    id: userId,
  } = userStore(state => state.user);

  // STATE & MISC
  const [dates, setDates] = useState({
    start: null,
    end: null,
  });
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
  const [invitees, setInvitees] = useState([]);

  const pageRef = useRef(null);

  const createData = [
    {
      title: i18n.t('Title'),
      content: getTitleContent(),
    },
    {
      title: i18n.t('Dates'),
      content: getDateContent(),
    },
    {
      title: i18n.t('Location'),
      content: getLocationContent(),
    },
  ];

  const getDateValue = () => {
    console.log(dates);
    if (!dates.start || !dates.end) {
      return;
    }
    console.log('123123hello');

    const start =
      dates.start && Utils.getDateFromTimestamp(dates.start, 'Do MMM YYYY');
    const end =
      dates.end && Utils.getDateFromTimestamp(dates.end, 'Do MMM YYYY');

    return `${start} - ${end}`;
  };

  const handleChange = isBack => {
    if (pageIndex === 0 && isBack) {
      onRequestClose();
      cleanData();
      return;
    }

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

  const navigatePage = index => {
    Keyboard.dismiss();

    setTimeout(() => {
      pageRef.current?.setPage(index);
      setPageIndex(index);
    }, 100);
  };

  const checkButtonDisbled = index => {
    switch (index) {
      case 0:
        return tripName?.trim().length > 0;
      case 1:
        return dates?.start && dates?.end;
      case 2:
        return location?.placeName?.trim() > 0 || location?.latlon?.length > 1;
      default:
        return true;
    }
  };

  const cleanData = () => {
    setCreateData([
      {
        title: i18n.t('Title'),
        isDone: false,
        content: () => getTitleContent(),
      },
      {
        title: i18n.t('Dates'),
        isDone: false,
        content: () => getDateContent(),
      },
      {
        title: i18n.t('Location'),
        isDone: false,
        content: () => getLocationContent(),
      },
    ]);
    setTripName('');
    setLocation({
      string: '',
      latlon: [],
    });
    setDates({
      start: null,
      end: null,
    });
    setInvitees([]);
    onRequestClose();
    setPageIndex(0);
  };

  const handleData = async () => {
    return;

    const {placeName, latlon} = location;
    const param = invitees.toString().replace(',', '&');

    await addTrip({
      variables: {
        trip: {
          dateRange: {
            endDate: dates.end,
            startDate: dates.start,
          },
          destination: {
            placeName,
            latlon,
          },
          title: tripName,
        },
      },
    })
      .catch(e => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      })
      .then(res => {
        const id = res.data.createTrip;
        const type = Utils.getTripTypeFromDate({
          startDate: dates.start,
          endDate: dates.end,
        });
        httpService.sendInvitations(param, id);
        addTripState({
          id,
          thumbnailUri: null,
          title: tripName,
          description: null,
          destinations: [
            {
              placeName,
              latlon,
            },
          ],
          activeMembers: [
            {
              avatarUri,
              firstName,
              lastName,
              id: userId,
            },
          ],
          dateRange: {
            endDate: dates.end,
            startDate: dates.start,
          },
          type,
        });
      });

    cleanData();
  };

  const getDateContent = () => (
    <>
      <View style={{marginHorizontal: PADDING.l}}>
        <Subtitle type={1} text={i18n.t('Choose a date')} />
        <Body
          type={2}
          color={COLORS.neutral[500]}
          text={i18n.t('You can always change the date later')}
        />
        <TextField
          onPress={() => setCalendarVisible(true)}
          onPrefixPress={() => setCalendarVisible(true)}
          focusable={false}
          disabled
          style={{marginTop: 10, marginBottom: 10}}
          value={getDateValue()}
          icon="calendar"
          placeholder={i18n.t('Select a date')}
        />
      </View>
    </>
  );

  const getLocationContent = () => (
    <View style={{marginHorizontal: PADDING.l}}>
      <Subtitle type={1} text={i18n.t('Choose a location')} />
      <Body
        type={2}
        color={COLORS.neutral[500]}
        text={i18n.t('You can always change or add locations later')}
      />
      <TextField
        style={{marginTop: 10, marginBottom: 10}}
        value={location.placeName || null}
        onChangeText={val =>
          setLocation({
            placeName: val,
            latlon: [],
          })
        }
        placeholder={i18n.t('Paris, France 🇫🇷')}
        onDelete={() =>
          setLocation({
            placeName: '',
            latlon: [],
          })
        }
        geoMatching
        onSuggestionPress={sugg =>
          setLocation({
            placeName: sugg.string,
            latlon: sugg.location,
          })
        }
      />
      <PopUpModal
        isVisible={popUpVisible}
        title={i18n.t('No rush!')}
        subtitle={i18n.t(
          "You don't need to add the Location yet. You can always come back and change the date whenever you need to. 👍🏽",
        )}
        onRequestClose={() => setPopUpVisible(false)}
      />
    </View>
  );

  const getTitleContent = () => (
    <View style={{marginHorizontal: PADDING.l}}>
      <Subtitle type={1} text={i18n.t('Name the trip')} />
      <TextField
        style={{marginTop: 10, marginBottom: 20}}
        value={tripName || null}
        maxLength={25}
        onChangeText={val => setTripName(val)}
        placeholder={i18n.t('Epic Summer Trip 2021 ✈️')}
        onDelete={() => setTripName('')}
      />

      <Subtitle
        type={1}
        color={COLORS.neutral[300]}
        text={i18n.t('Description (optional)')}
      />
      <TextField
        mulitline
        style={{
          marginTop: 10,
          marginBottom: 10,
          paddingBottom: 50,
          paddingTop: 25,
        }}
        value={tripName || null}
        maxLength={100}
        onChangeText={val => setTripName(val)}
        placeholder={i18n.t('Set description')}
        onDelete={() => setTripName('')}
      />
    </View>
  );

  const getStatusContainer = () => {
    return (
      <View style={{marginBottom: 20, marginTop: -10}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginHorizontal: -PADDING.l}}
          contentContainerStyle={{
            paddingHorizontal: PADDING.l,
          }}>
          {createData.map((c, index) => {
            const {isDone, title} = c;
            const backgroundColor = isDone
              ? Utils.addAlpha(COLORS.success[700], 0.15)
              : COLORS.neutral[100];
            const fontColor = isDone
              ? COLORS.success[900]
              : COLORS.neutral[500];
            const iconColor = isDone
              ? COLORS.success[900]
              : COLORS.neutral[300];

            return (
              <Pressable style={{height: 30, flexDirection: 'row'}}>
                <View
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor,
                      borderColor:
                        pageIndex === index
                          ? Utils.addAlpha(fontColor, 0.3)
                          : 'transparent',
                    },
                  ]}>
                  <Icon
                    name={isDone ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={iconColor}
                  />
                  <Subtitle
                    style={{marginLeft: 4}}
                    type={1}
                    text={title}
                    color={fontColor}
                  />
                </View>
                {index !== createData.length - 1 && (
                  <View style={styles.dash} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <TitleModal
      isVisible={isVisible}
      title={i18n.t('Create new trip')}
      onRequestClose={() => {
        onRequestClose();
        cleanData();
      }}>
      <KeyboardView behavior="padding" paddingBottom={40}>
        <View style={styles.container}>
          {getStatusContainer()}
          <PagerView
            style={{
              flex: 1,
              marginHorizontal: -PADDING.l,
            }}
            ref={pageRef}
            scrollEnabled={false}>
            {createData.map(item => item.content())}
          </PagerView>
          <PageIndicator
            data={createData}
            pageIndex={pageIndex}
            style={{alignSelf: 'center', marginBottom: 14}}
          />
          <View style={styles.buttonContainer}>
            <BackButton
              closeIcon={true}
              style={{height: 50, width: 50, borderRadius: RADIUS.xl}}
              onPress={() => handleChange(true)}
            />
            <Button
              isDisabled={checkButtonDisbled()}
              isLoading={loading}
              text={i18n.t('Continue')}
              onPress={() => handleChange()}
            />
          </View>
        </View>
      </KeyboardView>

      <CalendarModal
        minDate={true}
        onApplyClick={datesData => {
          setCalendarVisible(false);
          const {timestamp: endDate} = datesData.end;
          const {timestamp: startDate} = datesData.start;
          console.log(endDate);
          console.log(startDate);
          setDates({
            start: startDate / 1000,
            end: endDate / 1000,
          });
        }}
        onRequestClose={() => setCalendarVisible(false)}
        isVisible={calendarVisible}
      />

      <InputModal
        isVisible={inputVisible}
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize={false}
        emailInput
        multipleInputs
        placeholder={i18n.t('john.doe@email.com')}
        onRequestClose={() => setInputVisible(false)}
        onPress={input => setInvitees(prev => prev.concat(input))}
        autoClose
      />
      <Toast config={toastConfig} />
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  wrapContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusChip: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    height: 30,
    paddingHorizontal: 10,
  },
  dash: {
    height: 1,
    width: 20,
    marginHorizontal: 4,
    backgroundColor: COLORS.neutral[300],
    alignSelf: 'center',
  },
});
