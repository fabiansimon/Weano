import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../constants/Theme';
import Body from './typography/Body';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import Icon from 'react-native-vector-icons/AntDesign';
import TripContainer from './Trip/TripContainer';
import Utils from '../utils';

export default function StorySection({
  style,
  contentContainerStyle,
  data,
  onLongPress,
}) {
  const navigation = useNavigation();
  const [sortedData, setSortedData] = useState([]);

  const getEmptyContainer = useCallback(() => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={{alignItems: 'center', marginTop: 2}}>
          <View style={styles.emptyContainer} />
          <View
            style={[
              styles.placeholder,
              {height: 10, marginTop: 10, marginBottom: 4, width: 43},
            ]}
          />
          <View style={[styles.placeholder, {height: 7, width: 28}]} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginLeft: 28,
            marginTop: 4,
          }}>
          <Icon
            name="arrowleft"
            style={{marginTop: 4, marginRight: 4}}
            color={COLORS.neutral[300]}
          />
          <Body
            style={{
              textAlign: 'right',
            }}
            color={COLORS.neutral[300]}
            numberOfLines={3}
            ellipsizeMode="tail"
            type={2}
            text={i18n.t('Your memories will be shown here')}
          />
        </View>
      </View>
    );
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setSortedData(
      data
        .slice()
        .filter(
          ({type}) =>
            type === 'recent' || type === 'recap' || type === 'active',
        ),
    );
  }, [data]);

  return (
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}>
        {/* <Pressable
          onPress={() => navigation.push(ROUTES.mapScreen)}
          style={{marginRight: 14}}>
          <View style={styles.mapButton}>
            <Headline type={1} text="🌍" />
          </View>
          <Body
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{marginTop: 6, marginBottom: -2, textAlign: 'center'}}
            type={2}
            text={i18n.t('See Map')}
          />
          <Label
            style={{textAlign: 'center'}}
            type={1}
            color={COLORS.neutral[300]}
            text={`${data.length} ${i18n.t('Trips')}`}
          />
        </Pressable> */}
        {sortedData.length > 0
          ? sortedData.map(trip => {
              const {type} = trip;
              if (type === 'upcoming' || type === 'soon') {
                return;
              }
              return (
                <TripContainer
                  key={trip.id}
                  disabled={false}
                  onPress={() =>
                    navigation.push(ROUTES.memoriesScreen, {
                      tripId: trip.id,
                      initShowStory: true,
                    })
                  }
                  onLongPress={onLongPress}
                  trip={trip}
                />
              );
            })
          : getEmptyContainer()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapButton: {
    height: 68,
    width: 68,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    height: 68,
    width: 68,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 0.5,
    borderColor: Utils.addAlpha(COLORS.neutral[300], 0.1),
    borderRadius: 20,
  },
  placeholder: {
    backgroundColor: COLORS.neutral[100],
    borderWidth: 0.5,
    borderColor: Utils.addAlpha(COLORS.neutral[300], 0.1),
    borderRadius: 4,
  },
});
