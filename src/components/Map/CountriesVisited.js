import {
  View, StyleSheet, FlatList,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS, { PADDING } from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Button from '../Button';
import userStore from '../../stores/UserStore';
import Body from '../typography/Body';
import SearchResultTile from '../Search/SearchResultTile';
import Utils from '../../utils';

export default function CountriesVisited({
  onSearchPress, onPress, data,
}) {
  // STORES
  const { firstName } = userStore((state) => state.user);

  const recentTrips = data.filter((trip) => trip.type === 'recent').length;
  const activeTrips = data.filter((trip) => trip.type === 'active').length;
  const upcomingTrips = data.filter((trip) => trip.type === 'upcoming' || trip.type === 'soon').length;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.handler} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Headline
                type={3}
                style={{ fontWeight: '400', marginRight: 4 }}
                text={i18n.t('Hey')}
              />
              <Headline
                type={3}
                text={firstName}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(COLORS.error[700], 0.2) }]}>
                <Body
                  type={2}
                  color={COLORS.error[700]}
                  style={{ fontWeight: '500' }}
                  text={`${activeTrips} ${i18n.t('Active')}`}
                />
              </View>
              <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(COLORS.success[700], 0.2) }]}>
                <Body
                  type={2}
                  color={COLORS.success[700]}
                  style={{ fontWeight: '500' }}
                  text={`${upcomingTrips} ${i18n.t('Upcoming')}`}
                />
              </View>
              <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(COLORS.primary[700], 0.2) }]}>
                <Body
                  type={2}
                  color={COLORS.primary[700]}
                  style={{ fontWeight: '500' }}
                  text={`${recentTrips} ${i18n.t('Recent')}`}
                />
              </View>
            </View>
          </View>
          <Button
            style={[styles.searchButton, styles.buttonShadow]}
            backgroundColor={COLORS.shades[0]}
            onPress={onSearchPress}
            icon={<Icon name="search1" size={20} />}
            fullWidth={false}
            color={COLORS.neutral[900]}
          />
        </View>
        <FlatList
          style={{ marginTop: 20, paddingHorizontal: PADDING.m }}
          ListEmptyComponent={() => (
            <Body
              style={{ alignSelf: 'center', marginTop: 10 }}
              type={1}
              text={i18n.t('No Trips to show 😢')}
              color={COLORS.neutral[300]}
            />
          )}
          data={data}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <SearchResultTile
              onPress={() => onPress(item.id)}
              data={item}
            />
          )}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.06,
    shadowRadius: 10,
    paddingVertical: 15,
  },
  handler: {
    alignSelf: 'center',
    width: 60,
    height: 7,
    borderRadius: 100,
    backgroundColor: COLORS.shades[0],
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  titleContainer: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 4,
    marginRight: 8,
  },
});
