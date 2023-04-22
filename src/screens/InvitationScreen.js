import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, {useRef, useEffect, useState} from 'react';
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
import ROUTES from '../constants/Routes';
import GET_INVITATION_TRIP_DATA from '../queries/getInvitationTripData';
import JOIN_TRIP from '../mutations/joinTrip';
import userStore from '../stores/UserStore';
import Divider from '../components/Divider';
import Avatar from '../components/Avatar';
import BackButton from '../components/BackButton';

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

  // STATE & MISC
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (data) {
      const {getTripById} = data;
      setTripData(getTripById);
    }
  }, [data, error, jError]);

  const handleJoinTrip = async () => {
    setIsLoading(true);

    try {
      await joinTrip({
        variables: {
          tripId,
        },
      }).then(() => {
        setIsLoading(false);
        return navigation.navigate(ROUTES.tripScreen, {tripId, isJoined: true});
      });
    } catch (e) {
      setIsLoading(false);
      Alert.alert(i18n.t('Whoops'), e.message, [
        {
          text: i18n.t('Ok'),
          onPress: () => navigation.navigate(ROUTES.mainScreen),
        },
      ]);
    }
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
      i18n.t('Leave'),
      i18n.t('Are you sure you want to leave without joining the trip?'),
      i18n.t('Leave'),
      async () => {
        navigation.navigate(ROUTES.mainScreen);
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
        <Headline type={3} text={tripData && tripData.title} />
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
          style={{marginTop: 2, marginLeft: 6, color: COLORS.shades[100]}}
        />
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'} />
      {loading || !data || error ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : (
        <SafeAreaView style={{flex: 1, marginRight: 2}}>
          <KeyboardView paddingBottom={40}>
            <View style={styles.inviteContainer}>
              <View>
                <BackButton
                  onPress={handleDecline}
                  isClear
                  style={{marginBottom: 10}}
                />
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
              <View
                style={{
                  width: '100%',
                  height: 55,
                  marginBottom: Platform.OS === 'android' ? 18 : 0,
                }}>
                <Button
                  isLoading={isLoading}
                  text={i18n.t('Join Trip')}
                  onPress={handleJoinTrip}
                />
              </View>
            </View>
          </KeyboardView>
        </SafeAreaView>
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
