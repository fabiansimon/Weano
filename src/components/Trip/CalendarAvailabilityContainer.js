/* eslint-disable react/jsx-curly-brace-presence */
import {
  ScrollView, StyleSheet, View,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Divider from '../Divider';
import Label from '../typography/Label';
import i18n from '../../utils/i18n';
import Utils from '../../utils';
import Avatar from '../Avatar';
import Subtitle from '../typography/Subtitle';
import CalendarDateTile from './CalendarDateTile';
import FilterModal from '../FilterModal';

export default function CalendarAvailabilityContainer({ style }) {
  const [monthVisible, setMonthVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(6);
  const CELL_HEIGHT = 70;
  const CELL_WIDTH = 50;
  const dateFormat = 'MMDYY';
  let monthArray = [];

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
        name: 'Dezember',
        value: 11,
      },
    ],
  };

  const mockData = [
    {
      name: 'Fabian',
      available_dates: [
        1659347334,
        1659433734,
        1659610134,
        1659700134,
        1659790134,
        1661261227,
      ],
    },
    {
      name: 'Didi',
      available_dates: [
        1659347334,
      ],
    },
    {
      name: 'Julia',
      available_dates: [
        1659347334,
      ],
    },
    {
      name: 'René',
      available_dates: [
        165934733,
        1659610134,
        1659700134,
        1659790134,
      ],
    },
    {
      name: 'Clembo',
      available_dates: [
        1659347334,
        1659433734,
        1659610134,
        1659790134,
      ],
    },
  ];

  const getDaysOfMonth = () => {
    const now = moment();
    const year = moment().year();
    const month = moment().month();
    const daysAmount = new Date(year, month, 0).getDate();
    const startDay = moment(now).startOf('month');
    // const endDay = moment(now).endOf('month');

    monthArray = [];

    for (let i = 0; i < daysAmount; i += 1) {
      const day = startDay;
      monthArray.push({
        dayString: Utils.getDayFromInt(day.day()),
        dayDate: day.date(),
        dayData: day.format(dateFormat),
      });
      startDay.add(1, 'day');
    }

    return monthArray;
  };

  const isAvailable = (person, date) => {
    const currentDate = date.dayData;

    for (let i = 0; i < person.available_dates.length; i += 1) {
      const personDate = Utils.getDateFromTimestamp(person.available_dates[i], dateFormat);
      if (personDate === currentDate) {
        return true;
      }
    }
    return false;
  };

  const availbleExplanation = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: 8, width: 8, borderRadius: 100, marginTop: 2, marginRight: 6, backgroundColor: COLORS.primary[700],
        }}
        />
        <Label
          type={1}
          color={COLORS.primary[700]}
          text={i18n.t('available')}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
        <View style={{
          height: 8, width: 8, borderRadius: 100, marginTop: 2, marginRight: 6, borderWidth: 1, borderColor: COLORS.neutral[300],
        }}
        />
        <Label
          type={1}
          color={COLORS.neutral[300]}
          text={i18n.t('unavailable')}
        />
      </View>
    </View>
  );

  const getAvatarTile = (person) => (
    <View style={{
      height: CELL_HEIGHT, width: CELL_WIDTH, justifyContent: 'center', alignItems: 'center',
    }}
    >
      <Avatar
        size={35}
        uri={'https://i.pravatar.cc/300'}
      />
      <Subtitle
        type={2}
        text={person.name}
        style={{ marginTop: 2 }}
        color={COLORS.neutral[500]}
      />
    </View>
  );

  const getHeader = () => (
    <View style={[styles.column, { height: CELL_HEIGHT, alignItems: 'center' }]}>
      <View style={{ width: 50 }} />
      {getDaysOfMonth().map((date) => (
        <CalendarDateTile
          date={date}
          style={{ width: 50 }}
        />
      )) }
    </View>
  );

  const getColumn = (index) => {
    const person = mockData[index];

    return (
      <View style={styles.column}>
        {getAvatarTile(person)}
        {getDaysOfMonth().map((date) => (
          <View style={{
            height: CELL_HEIGHT, width: CELL_WIDTH, alignItems: 'center', justifyContent: 'center',
          }}
          >
            <BouncyCheckbox
              size={30}
              disableText
              isChecked={isAvailable(person, date)}
              fillColor={COLORS.primary[700]}
              iconStyle={{
                borderRadius: 10,
                borderColor: COLORS.neutral[100],
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Icon
          name="arrowleft"
          suppressHighlighting
          onPress={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)}
          size={22}
        />
        <TouchableOpacity
          onPress={() => setMonthVisible(true)}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Headline type={3} text={Utils.getMonthFromInt(currentMonth)} />
        </TouchableOpacity>
        <Icon
          name="arrowright"
          suppressHighlighting
          onPress={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)}
          size={22}
        />
      </View>
      <Divider vertical={2} />
      {availbleExplanation()}
      <ScrollView horizontal>
        <View
          style={{ paddingHorizontal: 8, marginTop: 10 }}
        >
          {getHeader()}
          {mockData.map((_, index) => getColumn(index))}
        </View>
      </ScrollView>
      <FilterModal
        isVisible={monthVisible}
        onRequestClose={() => setMonthVisible(false)}
        data={monthOptions}
        onPress={(m) => setCurrentMonth(m.value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'row',
    borderBottomColor: COLORS.neutral[50],
    borderBottomWidth: 1,
  },
  container: {
    backgroundColor: COLORS.shades[0],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  header: {
    paddingHorizontal: 10,
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
