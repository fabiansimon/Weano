import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, {useRef, useEffect, useState} from 'react';
import PagerView from 'react-native-pager-view';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {useMutation, useQuery} from '@apollo/client';
import KeyboardView from '../components/KeyboardView';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Body from '../components/typography/Body';
import Utils from '../utils';
import Button from '../components/Button';
import SignUpScreen from './Intro/SignUpScreen';
import ROUTES from '../constants/Routes';
import GET_INVITATION_TRIP_DATA from '../queries/getInvitationTripData';
import JOIN_TRIP from '../mutations/joinTrip';
import userStore from '../stores/UserStore';
import Divider from '../components/Divider';
import Avatar from '../components/Avatar';
import DefaultImage from '../../assets/images/default_trip.png';

export default function InvitationScreen({route}) {
  // PARAMS
  const {tripId} = route.params;
  // QUERIES
  const {loading, error, data} = useQuery(GET_INVITATION_TRIP_DATA, {
    variables: {
      tripId,
    },
  });

  // MUTAIONS
  const [joinTrip, {jError}] = useMutation(JOIN_TRIP);

  // STORES
  const {authToken} = userStore(state => state.user);

  // STATE & MISC
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef();

  const navigation = useNavigation();

  const isAuth = authToken !== '';

  useEffect(() => {
    if (error || jError) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error ? error.message : jError.message,
      });
    }

    if (data) {
      const {getTripById} = data;
      setTripData(getTripById);
    }
  }, [data, error, jError]);

  const handlePress = () => {
    if (!isAuth) {
      pageRef.current?.setPage(1);
      return;
    }
    handleJoinTrip();
  };

  const handleJoinTrip = async () => {
    setIsLoading(true);
    await joinTrip({
      variables: {
        tripId,
      },
    })
      .catch(e => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
      })
      .then(() => {
        navigation.navigate(ROUTES.initDataCrossroads);
      });

    setIsLoading(false);
  };

  const getDateRange = () => {
    const {startDate, endDate} = tripData.dateRange;
    const start = Utils.getDateFromTimestamp(
      startDate,
      endDate ? 'MM.DD' : 'MM.DD.YY',
    );
    const end = endDate
      ? Utils.getDateFromTimestamp(endDate, 'MM.DD.YY')
      : i18n.t('open');

    return `${start} - ${end}`;
  };

  const handleDecline = async () => {
    Utils.showConfirmationAlert(
      i18n.t('Decline Invitation'),
      i18n.t('Are you sure you want to decline the invitation?'),
      i18n.t('Decline'),
      async () => {
        navigation.navigate(ROUTES.initDataCrossroads);
      },
    );
  };

  const getTripInviteContainer = () => (
    <View style={styles.tripInvite}>
      <View>
        {tripData?.thumbnailUri && (
          <Image
            source={{uri: tripData.thumbnailUri}}
            style={{
              height: 120,
              borderTopLeftRadius: RADIUS.s,
              borderTopRightRadius: RADIUS.s,
            }}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}>
          {tripData?.activeMembers.map(member => (
            <Avatar
              disabled
              key={member.id}
              data={member}
              size={24}
              style={{marginLeft: -8}}
            />
          ))}
        </View>
      </View>
      <View style={{marginHorizontal: 10, marginTop: 8}}>
        <Headline type={3} isDense text={tripData && tripData.title} />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            marginBottom: 2,
            marginHorizontal: -PADDING.m,
            paddingLeft: PADDING.m,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
            <Icon name="location-pin" color={COLORS.neutral[900]} size={18} />
            <Body
              type={1}
              style={{marginLeft: 2}}
              color={COLORS.neutral[900]}
              text={
                tripData?.destinations[0].placeName.split(',')[0] ||
                i18n.t('No location yet')
              }
            />
          </View>
          <View
            style={{
              marginLeft: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AntIcon name="calendar" size={18} color={COLORS.neutral[900]} />
            <Body
              type={1}
              style={{marginLeft: 8}}
              color={COLORS.neutral[900]}
              text={
                tripData?.dateRange?.startDate
                  ? getDateRange()
                  : i18n.t('No date yet')
              }
            />
          </View>
        </View>
        <Divider />
        <Body
          type={2}
          text={
            tripData?.description ||
            i18n.t('No description yet for this trip ✒️')
          }
          style={{marginTop: 2, marginLeft: 6, color: COLORS.neutral[700]}}
        />
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      {loading || !data || error ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : (
        <PagerView
          style={{flex: 1, backgroundColor: COLORS.neutral[50]}}
          ref={pageRef}
          scrollEnabled={false}>
          <SafeAreaView style={{flex: 1, marginRight: 2}}>
            <KeyboardView paddingBottom={40}>
              <View style={styles.inviteContainer}>
                <View>
                  <Headline
                    type={3}
                    text={i18n.t("You've been invited!")}
                    color={COLORS.shades[100]}
                  />
                  <Body
                    type={1}
                    text={i18n.t("Let's go! What are you waiting for?")}
                    style={{marginTop: 2}}
                    color={COLORS.neutral[300]}
                  />
                  {tripData && getTripInviteContainer()}
                </View>
                <View style={{width: '100%', height: 100}}>
                  <Button
                    isLoading={isLoading}
                    text={i18n.t('Continue')}
                    onPress={handlePress}
                  />
                  <Body
                    type={1}
                    text={i18n.t('Decline Invitation')}
                    onPress={handleDecline}
                    style={{marginTop: 18, textAlign: 'center'}}
                    color={COLORS.neutral[300]}
                  />
                </View>
              </View>
            </KeyboardView>
          </SafeAreaView>
          {!isAuth ? <SignUpScreen invitationId={tripId} /> : <View />}
        </PagerView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inviteContainer: {
    marginTop: 20,
    marginHorizontal: PADDING.l,
    justifyContent: 'space-between',
    flex: 1,
  },
  tripInvite: {
    // overflow: 'hidden',
    marginTop: 50,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    marginHorizontal: -5,
    paddingBottom: 15,
    shadowColor: COLORS.neutral[500],
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: {},
  },
});
