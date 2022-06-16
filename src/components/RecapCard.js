import {
  View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';
import Body from './typography/Body';

export default function RecapCard({ data, style }) {
  // format UNIX timestamp to readable date
  const getDate = (timestamp, suffix) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format(`MMM Do ${suffix ? 'YY' : ''}`);
  };

  return (
    <TouchableOpacity style={[styles.container, style]}>
      <Image style={{ flex: 3, backgroundColor: COLORS.primary[300] }} source={{ uri: data.images[0] }} />
      <View style={styles.secondRow}>
        <Image style={{ flex: 1 }} source={{ uri: data.images[1] }} />
        <Image style={{ flex: 1 }} source={{ uri: data.images[2] }} />
      </View>
      <View style={styles.thirdRow}>
        <Image style={{ flex: 1 }} source={{ uri: data.images[3] }} />
        <Image style={{ flex: 1 }} source={{ uri: data.images[4] }} />
        <Image style={{ flex: 1 }} source={{ uri: data.images[5] }} />
      </View>
      <View style={styles.titleContainer}>
        <Headline
          type={3}
          text={data.title}
          color={COLORS.shades[0]}
          style={styles.textShadow}
        />
        <View style={styles.peopleContainer}>
          <Icon name="people-circle-sharp" color={COLORS.neutral[900]} size={18} />
          <Body type={2} text="2" color={COLORS.neutral[900]} />
        </View>
      </View>
      <View style={styles.descContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="calendar" color={COLORS.shades[0]} size={18} />
          <Body
            type={1}
            text={`${getDate(data.startDate)} - ${getDate(data.endDate, true)}`}
            color={COLORS.shades[0]}
            style={[styles.textShadow, { marginLeft: 6 }]}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="location" color={COLORS.shades[0]} size={20} />
          <Body
            type={1}
            text="getLocation()"
            color={COLORS.shades[0]}
            style={[styles.textShadow, { marginLeft: 6 }]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    aspectRatio: 0.78,
    overflow: 'hidden',
  },
  peopleContainer: {
    flexDirection: 'row',
    borderRadius: 100,
    backgroundColor: COLORS.shades[0],
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  secondRow: {
    flex: 3,
    flexDirection: 'row',
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowRadius: 2,
  },
  thirdRow: {
    flex: 2,
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  descContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
