import {View, StyleSheet, FlatList, Dimensions, Pressable} from 'react-native';
import React from 'react';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import userStore from '../../stores/UserStore';
import Body from '../typography/Body';
import Utils from '../../utils';
import RecapCardMini from '../RecapCardMini';

export default function CountriesVisited({onPress, data, onTap}) {
  // STORES
  const {firstName, countriesVisited} = userStore(state => state.user);

  const recentTrips = data.filter(trip => trip.type === 'recent');
  const activeTrips = data.filter(trip => trip.type === 'active');
  const upcomingTrips = data.filter(
    trip => trip.type === 'upcoming' || trip.type === 'soon',
  );

  const _trips = [...activeTrips, ...upcomingTrips, ...recentTrips];

  const {width} = Dimensions.get('window');

  return (
    <Pressable onPress={onTap} style={{flex: 1}}>
      <View style={styles.handler} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Headline type={4} text={`${i18n.t('Hey there')} ${firstName}!`} />
            <Body
              type={1}
              color={COLORS.neutral[300]}
              style={{marginTop: 2, marginBottom: 8}}
              text={`${i18n.t('You visitied')} ${
                countriesVisited.length
              } ${i18n.t('countries so far 🍹')}`}
            />
            <View
              style={{
                flexDirection: 'row',
                width,
                marginHorizontal: -PADDING.s,
                paddingLeft: PADDING.s,
                paddingRight: PADDING.s + 2,
              }}>
              <View
                style={[
                  styles.titleContainer,
                  {backgroundColor: Utils.addAlpha(COLORS.error[700], 0.2)},
                ]}>
                <Body
                  type={2}
                  color={COLORS.error[900]}
                  style={{fontWeight: '500'}}
                  text={`${activeTrips.length} ${i18n.t('Active')}`}
                />
              </View>
              <View
                style={[
                  styles.titleContainer,
                  {backgroundColor: Utils.addAlpha(COLORS.success[700], 0.2)},
                ]}>
                <Body
                  type={2}
                  color={COLORS.success[900]}
                  style={{fontWeight: '500'}}
                  text={`${upcomingTrips.length} ${i18n.t('Upcoming')}`}
                />
              </View>
              <View
                style={[
                  styles.titleContainer,
                  {backgroundColor: Utils.addAlpha(COLORS.primary[700], 0.2)},
                ]}>
                <Body
                  type={2}
                  color={COLORS.primary[700]}
                  style={{fontWeight: '500'}}
                  text={`${recentTrips.length} ${i18n.t('Recent')}`}
                />
              </View>
            </View>
          </View>
        </View>
        <FlatList
          style={{paddingTop: 14, paddingHorizontal: PADDING.s}}
          ListEmptyComponent={() => (
            <Body
              style={{alignSelf: 'center', marginTop: 10}}
              type={2}
              text={i18n.t('No Trips to show 😢')}
              color={COLORS.neutral[300]}
            />
          )}
          data={_trips}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          renderItem={({item}) => (
            <RecapCardMini
              key={item.id}
              onPress={() => onPress(item.id)}
              data={item}
            />
          )}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.neutral[50],
    borderTopRightRadius: RADIUS.s,
    borderTopLeftRadius: RADIUS.s,
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  handler: {
    alignSelf: 'center',
    width: 60,
    height: 7,
    borderRadius: 100,
    backgroundColor: COLORS.shades[0],
    marginBottom: 5,
  },
  header: {
    borderTopRightRadius: RADIUS.s,
    borderTopLeftRadius: RADIUS.s,
    backgroundColor: COLORS.shades[0],
    paddingVertical: 12,
    paddingHorizontal: PADDING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  titleContainer: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    flex: 1,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 8,
    alignItems: 'center',
  },
});
