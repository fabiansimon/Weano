import {
  View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InsetShadow from 'react-native-inset-shadow';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';
import DateContainer from './DateContainer';
import Avatar from './Avatar';
import IconButton from './IconButton';
import DaysContainer from './DaysContainer';

export default function RecapCard({ data, style, type = 'main' }) {
  const getRVSP = () => '4 yes • 1 maybes • 2 no\'s';

  const getMiniCard = () => (
    <TouchableOpacity style={[styles.miniContainer, styles.boxShadow, style]}>
      <View style={{
        justifyContent: 'center', padding: 6, flex: 1, marginRight: 26,
      }}
      >
        <Headline type={3} text={data.title} isDense numberOfLines={1} />
        <Headline type={4} text={getRVSP()} color={COLORS.neutral[700]} isDense />
      </View>
      <DaysContainer dates={data.dateRange} />
    </TouchableOpacity>
  );

  const getMainCard = () => (
    <TouchableOpacity style={[styles.container, styles.boxShadow, style]}>
      <InsetShadow
        containerStyle={{ height: 170, borderRadius: 10 }}
        shadowOpacity={0.11}
      >
        <Image
          source={{ uri: data.images[0] }}
          style={styles.image}
        />
        <DateContainer
          dates={data.dateRange}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
          }}
        />
      </InsetShadow>
      <View style={styles.detailsContainer}>
        <Headline type={3} text={data.title} />
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        >
          {data.invitees.map((invitee) => (
            <Avatar
              uri={invitee.uri}
              size={36}
              style={{ marginRight: -8 }}
            />
          ))}
          <Headline
            type={3}
            text="+2 more"
            color={COLORS.primary[700]}
            style={{ marginLeft: 14 }}
          />
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        >
          <Icon
            name="location-on"
            size={18}
            color={COLORS.neutral[500]}
          />
          <Headline
            type={4}
            text="Paris, France"
            color={COLORS.neutral[500]}
          />
        </View>
        <IconButton
          icon="heart"
          isActive={false}
          style={{ position: 'absolute', bottom: 4, right: 10 }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    type === 'mini' ? getMiniCard() : getMainCard()
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: COLORS.shades[0],
    aspectRatio: 0.95,
    height: 325,
    padding: 10,
  },
  miniContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: COLORS.shades[0],
    aspectRatio: 3.7,
    height: 85,
    padding: 10,
  },
  boxShadow: {
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  detailsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    borderRadius: 10,
    width: '100%',
    height: 170,
  },
});
