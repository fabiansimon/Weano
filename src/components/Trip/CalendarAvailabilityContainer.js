/* eslint-disable react/jsx-curly-brace-presence */
import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EntIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import Divider from '../Divider';
import i18n from '../../utils/i18n';
import Utils from '../../utils';
import Avatar from '../Avatar';
import Subtitle from '../typography/Subtitle';
import CalendarDateTile from './CalendarDateTile';
import FilterModal from '../FilterModal';
import activeTripStore from '../../stores/ActiveTripStore';

export default function CalendarAvailabilityContainer({style, onPress}) {
  // STORES
  const {activeMembers} = activeTripStore(state => state.activeTrip);

  // STATE & MISC
  const [monthVisible, setMonthVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [daysOfMonth, setdaysOfMonth] = useState([]);

  const CELL_HEIGHT = 60;
  const CELL_WIDTH = 50;
  const dateFormat = 'DDMMYY';

  const monthOptions = {
    title: 'Set month',
    options: [
      {
        name: i18n.t('January'),
        value: 0,
      },
      {
        name: i18n.t('February'),
        value: 1,
      },
      {
        name: i18n.t('March'),
        value: 2,
      },
      {
        name: i18n.t('April'),
        value: 3,
      },
      {
        name: i18n.t('May'),
        value: 4,
      },
      {
        name: i18n.t('June'),
        value: 5,
      },
      {
        name: i18n.t('July'),
        value: 6,
      },
      {
        name: i18n.t('August'),
        value: 7,
      },
      {
        name: i18n.t('September'),
        value: 8,
      },
      {
        name: i18n.t('Oktober'),
        value: 9,
      },
      {
        name: i18n.t('November'),
        value: 10,
      },
      {
        name: i18n.t('Dezember'),
        value: 11,
      },
    ],
  };

  useEffect(() => {
    getDaysOfMonth();
  }, [currentMonth]);

  const getDaysOfMonth = () => {
    const monthArray = [];
    const year = moment().year();
    const month =
      currentMonth + 1 < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
    const days = moment(`${year}-${month}`).daysInMonth();
    const startDay = new Date(year, currentMonth, 1);
    const day = moment(startDay);

    for (let i = 0; i < days; i += 1) {
      monthArray.push({
        dayString: Utils.getDayFromInt(day.day()),
        dayDate: day.date(),
        dayData: day.format(dateFormat),
      });
      day.add(1, 'day');
    }

    setdaysOfMonth(monthArray);
  };

  const getAvailabilites = date => {
    const day = date.dayData;
    let availableAmount = 0;
    for (let i = 0; i < activeMembers.length; i += 1) {
      const availabilites = activeMembers[i].available_dates;
      if (availabilites) {
        for (let j = 0; j < availabilites.length; j += 1) {
          if (
            day === Utils.getDateFromTimestamp(availabilites[j], dateFormat)
          ) {
            availableAmount += 1;
            break;
          }
        }
      }
    }

    return availableAmount / activeMembers.length;
  };

  const isAvailable = (person, date) => {
    const currentDate = date.dayData;

    if (person.available_dates) {
      for (let i = 0; i < person.available_dates.length; i += 1) {
        const personDate = Utils.getDateFromTimestamp(
          person.available_dates[i],
          dateFormat,
        );
        if (personDate === currentDate) {
          return true;
        }
      }
    }
    return false;
  };

  const getAvatarTile = person => (
    <View
      style={{
        height: CELL_HEIGHT,
        width: CELL_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Avatar disabled size={35} data={person} />
      <Subtitle
        type={2}
        text={person.name}
        style={{marginTop: 4}}
        color={COLORS.neutral[300]}
      />
    </View>
  );

  const getDateHeader = () => (
    <View style={[styles.column, {height: CELL_HEIGHT, alignItems: 'center'}]}>
      <View style={{width: CELL_WIDTH}} />
      {daysOfMonth &&
        daysOfMonth.map(date => {
          const opacity = getAvailabilites(date);
          return (
            <CalendarDateTile
              date={date}
              style={{width: CELL_WIDTH}}
              opacity={opacity}
            />
          );
        })}
    </View>
  );

  const getColumn = index => {
    const person = activeMembers[index];

    return (
      <View style={styles.column}>
        {getAvatarTile(person)}
        {daysOfMonth &&
          daysOfMonth.map(date => {
            const available = isAvailable(person, date);
            return (
              <TouchableOpacity
                onPress={onPress || null}
                style={{
                  height: CELL_HEIGHT,
                  width: CELL_WIDTH,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: available
                        ? COLORS.primary[700]
                        : COLORS.neutral[50],
                      borderWidth: available ? 0 : 1,
                    },
                  ]}>
                  {available && (
                    <EntIcon name="check" color={COLORS.shades[0]} size={16} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Icon
          name="arrowleft"
          suppressHighlighting
          onPress={() =>
            setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)
          }
          size={22}
        />
        <TouchableOpacity
          onPress={() => setMonthVisible(true)}
          style={{flex: 1, alignItems: 'center'}}>
          <Headline type={4} text={Utils.getMonthFromInt(currentMonth)} />
        </TouchableOpacity>
        <Icon
          name="arrowright"
          suppressHighlighting
          onPress={() =>
            setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)
          }
          size={22}
        />
      </View>
      <ScrollView horizontal>
        <View style={{paddingHorizontal: 8, marginTop: 10}}>
          {getDateHeader()}
          <Divider color={COLORS.neutral[50]} />
          {activeMembers.map((_, index) => getColumn(index))}
        </View>
      </ScrollView>
      <FilterModal
        isVisible={monthVisible}
        onRequestClose={() => setMonthVisible(false)}
        data={monthOptions}
        selectedIndex={currentMonth}
        onPress={m => setCurrentMonth(m.value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'row',
  },
  container: {
    backgroundColor: COLORS.shades[0],
    borderRadius: 14,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderRadius: RADIUS.s,
    borderColor: COLORS.neutral[100],
  },
  header: {
    paddingHorizontal: PADDING.l,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    marginTop: 20,
    marginRight: 10,
    alignItems: 'center',
  },
});
