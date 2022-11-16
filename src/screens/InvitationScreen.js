import {
  ActivityIndicator,
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useRef, useEffect, useState } from 'react';
import PagerView from 'react-native-pager-view';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import KeyboardView from '../components/KeyboardView';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Body from '../components/typography/Body';
import Utils from '../utils';
import Button from '../components/Button';
import SignUpScreen from './Intro/SignUpScreen';
import ROUTES from '../constants/Routes';
import GET_INVITATION_TRIP_DATA from '../queries/getInvitationTripData';

export default function InvitationScreen({ route }) {
  const { tripId } = route.params;

  const { loading, error, data } = useQuery(GET_INVITATION_TRIP_DATA, {
    variables: {
      tripId,
    },
  });

  const [tripData, setTripData] = useState(null);

  const pageRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
    }

    if (data) {
      const { getInvitationTripData } = data;
      setTripData(getInvitationTripData);
    }
  }, [data, error]);

  const getDateRange = () => {
    const { startDate, endDate } = tripData.dateRange;
    const start = Utils.getDateFromTimestamp(startDate, endDate ? 'MM.DD' : 'MM.DD.YY');
    const end = endDate ? Utils.getDateFromTimestamp(endDate, 'MM.DD.YY') : i18n.t('open');

    return `${start} - ${end}`;
  };

  const handleDecline = async () => {
    Utils.showConfirmationAlert(
      i18n.t('Decline Invitation'),
      i18n.t('Are you sure you want to decline the invitation?'),
      i18n.t('Decline'),
      async () => {
        navigation.navigate(ROUTES.introScreen);
      },
    );
  };

  const TripInviteContainer = () => (
    <View style={styles.tripInvite}>
      <Headline
        type={2}
        isDense
        text={tripData && tripData.title}
      />
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingRight: 30 }}
        style={{
          flexDirection: 'row',
          marginTop: 12,
          marginHorizontal: -PADDING.m,
          paddingLeft: PADDING.m,

        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="location-pin"
            color={COLORS.neutral[300]}
            size={20}
          />
          <Headline
            type={4}
            style={{ marginLeft: 4 }}
            color={COLORS.neutral[300]}
            text={tripData?.location || i18n.t('No location yet')}
          />
        </View>
        <View style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
          <AntIcon
            name="calendar"
            size={20}
            color={COLORS.neutral[300]}
          />
          <Headline
            type={4}
            style={{ marginLeft: 8 }}
            color={COLORS.neutral[300]}
            text={tripData?.dateRange?.startDate ? getDateRange() : i18n.t('No date yet')}
          />
        </View>

      </ScrollView>
      <View style={{
        marginTop: 18, padding: 10, backgroundColor: COLORS.neutral[50], borderRadius: 10,
      }}
      >
        <Body
          type={1}
          text={tripData?.description || i18n.t('No description yet for this trip ✒️')}
          style={{ marginLeft: 4, color: COLORS.neutral[300], fontStyle: 'italic' }}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading || !data || error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      )
        : (
          <PagerView
            style={{ flex: 1, backgroundColor: COLORS.neutral[50] }}
            ref={pageRef}
            scrollEnabled
          >
            <SafeAreaView style={{ flex: 1 }}>
              <KeyboardView paddingBottom={40}>
                <View style={styles.inviteContainer}>
                  <View>
                    <Headline
                      type={2}
                      text={i18n.t("You've been invited")}
                      color={COLORS.shades[100]}
                    />
                    <Headline
                      type={4}
                      text={`${tripData?.hostName} ${i18n.t('invited you to join a trip 🏝')}`}
                      style={{ marginTop: 4 }}
                      color={COLORS.neutral[500]}
                    />
                    <TripInviteContainer />
                  </View>
                  <View style={{ width: '100%', height: 100 }}>
                    <Button
                      isLoading={false}
                      text={i18n.t('Continue')}
                      onPress={() => pageRef.current?.setPage(1)}
                    />
                    <Headline
                      type={4}
                      text={i18n.t('Decline Invitation')}
                      onPress={handleDecline}
                      style={{ marginTop: 18, textAlign: 'center' }}
                      color={COLORS.neutral[300]}
                    />
                  </View>
                </View>
              </KeyboardView>
            </SafeAreaView>
            <SignUpScreen invitationId={tripId} />
          </PagerView>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  inviteContainer: {
    marginTop: 20,
    marginHorizontal: PADDING.xl,
    justifyContent: 'space-between',
    flex: 1,
  },
  tripInvite: {
    marginTop: 50,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderWidth: 0.5,
    padding: 15,
  },
  infoButton: {
    borderColor: COLORS.neutral[300],
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 12,
  },
  infoTile: {
    height: 40,
    borderWidth: 0,
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: 12,
  },
});
