import {Dimensions, Image, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import EntIcon from 'react-native-vector-icons/Entypo';
import ActivityChip from '../ActivityChip';
import i18n from '../../utils/i18n';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Body from '../typography/Body';
import Headline from '../typography/Headline';
import Utils from '../../utils';
import WebViewModal from '../WebViewModal';
import CalendarModal from '../CalendarModal';
import {AFFILIATE_DATA} from '../../constants/AffiliateData';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

const DAY_SECONDS = 86400;
const {width} = Dimensions.get('window');

export default function AffiliateInfoView({
  info,
  destinations,
  dateRange,
  amountPeople,
}) {
  // STATE & MISC
  const [nightsCounter, setNightsCounter] = useState(0);
  const [locations, setLocations] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [dates, setDates] = useState({
    start: 0,
    end: 0,
  });
  const [webInfo, setWebInfo] = useState({
    title: '',
    url: '',
    isVisible: false,
  });

  const ONE_DAY = 86400;

  const {startDate, endDate} = dateRange;

  useEffect(() => {
    if (!info) {
      return;
    }

    const {type} = info.link;
    const {index} = info;

    if (!type === 'transport') {
      return;
    }

    if (destinations.length <= 1) {
      return setLocations([destinations[0].placeName]);
    }

    if (!destinations[index - 1]) {
      return setLocations([
        destinations[index].placeName,
        destinations[index + 1].placeName,
      ]);
    }
    return setLocations([
      destinations[index - 1].placeName,
      destinations[index].placeName,
    ]);
  }, [info]);

  useEffect(() => {
    if (!isSleep) {
      return;
    }
    const diff = Utils.getDaysDifference(dates.start, dates.end, true);

    setNightsCounter(diff);
  }, [dates]);

  useEffect(() => {
    if (!info) {
      return;
    }

    if (destinations.length <= 1) {
      return setDates({
        start: startDate,
        end: endDate,
      });
    }

    const diff = Utils.getDaysDifference(
      dateRange.startDate,
      dateRange.endDate,
      true,
    );
    const split = parseInt((diff / destinations.length).toFixed(0), 10);
    setNightsCounter(split);

    const newStart = startDate + ONE_DAY * (split * info.index);
    const newEnd = newStart + ONE_DAY * split;
    setDates({
      start: newStart,
      end: newEnd,
    });
  }, [destinations]);

  if (!info) {
    return <View />;
  }

  const {index, link} = info;
  const isSleep = link.type === 'sleep';
  const isTransport = link.type === 'transport';
  const isDiscover = link.type === 'discover';
  // const isFood = link.type === 'food';

  const getTextData = () => {
    const date = Utils.getDateFromTimestamp(dates.start, 'DD.MM.YYYY');

    if (isSleep) {
      return {
        header: i18n.t('Sleep in'),
        title: i18n.t('Find accomodation'),
        subtitle: `${i18n.t('For')} ${nightsCounter} ${
          nightsCounter > 1 ? i18n.t('nights,') : i18n.t('night,')
        } ${amountPeople} ${i18n.t('people')}`,
        textfield: i18n.t('From'),
      };
    }

    if (isTransport) {
      return {
        header: i18n.t('Getting from'),
        title: i18n.t('Find transportation'),
        subtitle: `${i18n.t('On the')} ${date} ${i18n.t(
          'for',
        )} ${amountPeople} ${i18n.t('people')}`,
        textfield: i18n.t('On the'),
      };
    }
    if (isDiscover) {
      return {
        header: i18n.t('What to do in'),
        title: i18n.t('Find activites'),
        subtitle: `${i18n.t('On the')} ${date} ${i18n.t(
          'for',
        )} ${amountPeople} ${i18n.t('people')}`,
        textfield: i18n.t('On the'),
      };
    }
    return {
      header: i18n.t('Where to eat in'),
      title: i18n.t('Find where to eat'),
      subtitle: `${i18n.t('On the')} ${date} ${i18n.t(
        'for',
      )} ${amountPeople} ${i18n.t('people')}`,
      textfield: i18n.t('On the'),
    };
  };

  const textData = getTextData();

  const handleWeb = data => {
    setWebInfo({
      title: data.title,
      url: generateUrl(data.type),
      isVisible: true,
    });
  };

  const generateUrl = type => {
    const adults = amountPeople;
    const location = destinations[index].placeName;
    const checkIn = Utils.getDateFromTimestamp(dates.start, 'YYYY-MM-DD');
    const checkOut = Utils.getDateFromTimestamp(dates.end, 'YYYY-MM-DD');

    // https://www.airbnb.co.uk/s/Oaxaca/homes?query=Oaxac&checkin=2023-03-19&checkout=2023-04-04&adults=2
    // https://www.booking.com/ss=mexico%20city&checkin=2023-03-23&checkout=2023-03-26&group_adults=1
    // https://www.getyourguide.co.uk/s?q=Oaxaca%20de%20JuarezMexico&date_from=2023-08-02&date_to=2023-08-04
    // https://www.tripadvisor.com/Search?q=mexico%20city
    // https://www.viator.com/searchResults/all?text=Oaxaca+de+Juarez
    // https://www.rome2rio.com/map/Vienna/Mexico-City
    // https://www.hostelworld.com/findabed.php/ChosenCity.Mexico-City/ChosenCountry.Mexico
    // https://www.google.com/search?q=oaxaca+mexico+to+mexico+city+aug+14th+2023
    // https://www.google.com/maps/search/restaurants+mexico+city

    switch (type) {
      case 'hostelworld':
        return `https://www.hostelworld.com/findabed.php/ChosenCity.${location
          .split(',')[0]
          .replace(' ', '-')
          .trim()}`;
      case 'airbnb':
        return `https://www.airbnb.com/s/${location}/homes?query=${location}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`;
      case 'booking':
        return `https://www.booking.com/ss=${location}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}`;
      case 'hostelworld':
        return `https://www.booking.com/ss=${location}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}`;
      case 'yourGuide':
        return `https://getyourguide.com/s?q=${location}&date_from=${checkIn}`;
      case 'viator':
        return `https://www.viator.com/searchResults/all?text=${location}`;
      case 'tripAdvisor':
        return `https://www.tripadvisor.com/Search?q=${location.split(',')[0]}`;
      case 'rome2rio':
        return `https://www.rome2rio.com/map/${locations[0]}/{${locations[1]}}`;
      case 'googleTransport':
        return `https://www.google.com/search?q=${locations[0]}+to+${locations[1]}+${checkIn}`;
      case 'googleFood':
        return `https://www.google.com/maps/search/restaurants+in+${location}`;
      default:
        break;
    }
  };

  const handleCounter = amount => {
    RNReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    });

    let newEnd;
    if (amount === -1) {
      newEnd = dates.end - DAY_SECONDS;
    } else {
      newEnd = dates.end + DAY_SECONDS;
    }

    if (newEnd < dates.start + DAY_SECONDS) {
      return;
    }

    setDates(prev => ({
      start: prev.start,
      end: newEnd,
    }));
  };

  const getButtonContainer = () => {
    let data;
    switch (link.type) {
      case 'sleep':
        data = AFFILIATE_DATA.sleep;
        break;
      case 'transport':
        data = AFFILIATE_DATA.transport;
        break;
      case 'discover':
        data = AFFILIATE_DATA.discover;
        break;
      case 'food':
        data = AFFILIATE_DATA.food;
        break;
      default:
        break;
    }

    return (
      <View style={styles.buttonContainer}>
        {data.map((d, i) => {
          const {title, logo} = d;

          return (
            <Pressable
              key={i}
              onPress={() => handleWeb(d)}
              style={styles.simpleButton}>
              <Image style={{height: 18, width: 18}} source={logo} />
              <Body
                type={1}
                style={{fontWeight: '500', marginLeft: 6}}
                text={title}
              />
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: PADDING.l,
          width,
          alignItems: 'flex-start',
          marginTop: 30,
        }}>
        <ActivityChip data={link} />
        <Body
          type={1}
          color={COLORS.neutral[300]}
          text={textData?.header}
          style={{marginTop: 12, marginBottom: 2}}
        />
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <Headline
            type={4}
            text={isTransport ? locations[0] : destinations[index]?.placeName}
          />
          {isTransport && (
            <>
              <Body
                style={{marginHorizontal: 4}}
                type={1}
                color={COLORS.neutral[300]}
                text={i18n.t('to')}
              />
              <Headline type={4} text={locations[1]} />
            </>
          )}
        </View>
        <Pressable
          onPress={() => setCalendarVisible(true)}
          style={[styles.innerContainer, {marginTop: 16}]}>
          <View style={{flex: 1}}>
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={textData?.textfield}
            />
            <Body
              type={1}
              color={COLORS.shades[900]}
              text={Utils.getDateFromTimestamp(dates.start, 'MMM Do YYYY')}
            />
          </View>
          {isSleep && (
            <View style={{flex: 1}}>
              <Body type={2} color={COLORS.neutral[300]} text={i18n.t('To')} />
              <Body
                type={1}
                color={COLORS.shades[900]}
                text={Utils.getDateFromTimestamp(dates.end, 'MMM Do YYYY')}
              />
            </View>
          )}
        </Pressable>
        {isSleep && (
          <View style={[styles.innerContainer, {marginTop: 16}]}>
            <Pressable
              onPress={() => handleCounter(-1)}
              style={{
                flex: 1,
                alignItems: 'flex-start',
                paddingLeft: 15,
                height: 40,
                justifyContent: 'center',
              }}>
              <EntIcon name="minus" color={COLORS.shades[100]} size={20} />
            </Pressable>
            <View
              style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
              <Body
                type={2}
                color={COLORS.neutral[300]}
                text={i18n.t('Nights')}
              />
              <Headline
                type={4}
                color={COLORS.shades[900]}
                text={nightsCounter}
              />
            </View>
            <Pressable
              onPress={() => handleCounter(+1)}
              style={{
                flex: 1,
                alignItems: 'flex-end',
                paddingRight: 15,
                height: 40,
                justifyContent: 'center',
              }}>
              <EntIcon name="plus" color={COLORS.shades[100]} size={20} />
            </Pressable>
          </View>
        )}
        <Headline
          type={4}
          style={{marginTop: 40, marginBottom: 2}}
          text={textData?.title}
        />
        <Body type={1} color={COLORS.neutral[300]} text={textData?.subtitle} />
        {getButtonContainer()}
      </View>
      <WebViewModal
        url={webInfo?.url}
        isVisible={webInfo?.isVisible}
        onRequestClose={() =>
          setWebInfo(prev => ({
            ...prev,
            isVisible: false,
          }))
        }
        title={webInfo?.title}
      />
      <CalendarModal
        minDate={false}
        isVisible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
        isSingleDate={!isSleep}
        initialStartDate={dates?.start}
        initialEndDate={dates?.end}
        onApplyClick={datesData => {
          if (!isSleep) {
            setDates({
              start: datesData.timestamp / 1000 || 0,
              end: 0,
            });
          } else {
            setDates({
              start: datesData.start.timestamp / 1000 || 0,
              end: datesData.end.timestamp / 1000 || 0,
            });
          }
          setCalendarVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    marginHorizontal: -4,
    borderColor: COLORS.neutral[100],
    flexDirection: 'row',
    paddingHorizontal: 13,
    paddingVertical: 10,
    alignItems: 'center',
  },
  simpleButton: {
    marginBottom: 6,
    marginRight: 6,
    borderRadius: 100,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
    flexDirection: 'row',
    minHeight: 42,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
