/* eslint-disable import/no-extraneous-dependencies */
import 'react-native-get-random-values';
import moment from 'moment';
import {
  MAPBOX_TOKEN,
  // eslint-disable-next-line import/no-unresolved
} from '@env';
import { Alert } from 'react-native';
import i18n from './i18n';

export default class Utils {
  /**
     * Format UNIX Timestamp to MMM Do (YY) date
     * @param {Number} timestamp - UNIX Timestamp
     * @param {String} format - e.g. 'MMM Do'
     * @return {String} Nicely formatted Date
     */
  static getDateFromTimestamp(timestamp, format) {
    const date = new Date(timestamp * 1000);
    return moment(date).format(format);
  }

  /**
     * Format UNIX Timestamp to MMM Do (YY) date
     * @param {Number} timestamp - UNIX Timestamp
     * @return {String} Nicely formatted HH:SS
     */
  static getTimeFromTimeStamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${moment(date).hours()}:${moment(date).minutes()}`;
  }

  /**
     * Convert Date to UNIX timestamp
     * @param {String} date - Date
     * @return {Integer} Timestamp
     */
  static convertDateToTimestamp(date) {
    const formatedDate = moment(date).format();
    return moment(formatedDate).format('X');
  }

  /**
     * Convert Date to UNIX timestamp
     * @param {Integer} date - Date
     * @return {boolean} isFuture
     */
  static checkIsFuture(startDate) {
    const today = Date.now();
    if (today > startDate * 1000) return false;
    return true;
  }

  /**
     * Show confirmation Alert
     * @param {String} title - Title
     * @param {String} subtitle - Subtitle
     * @param {String} action - action
     * @return {boolean} isFuture
     */
  static showConfirmationAlert(title, subtitle, actionMessage, action) {
    Alert.alert(
      title,
      subtitle,
      [
        {
          text: i18n.t('Cancel'),
          style: 'cancel',
        },
        {
          text: actionMessage,
          onPress: () => action(),
          style: 'destructive',
        },
      ],
    );
  }

  /**
     * Convert DayInt to a Day String
     * @param {Integer} day - day in Int (0-6)
     * @return {String} Day in String; e.q. 'Monday'
     */
  static getDayFromInt(day) {
    switch (day) {
      case 0:
        return i18n.t('Sun');
      case 1:
        return i18n.t('Mon');
      case 2:
        return i18n.t('Tue');
      case 3:
        return i18n.t('Wed');
      case 4:
        return i18n.t('Thu');
      case 5:
        return i18n.t('Fri');
      case 6:
        return i18n.t('Sat');
      default:
        return -1;
    }
  }

  /**
     * Convert MonthInt to a Month String
     * @param {Integer} month - month in Int (0-12)
     * @return {String} Month in String; e.q. 'January'
     */
  static getMonthFromInt(month) {
    switch (month) {
      case 0:
        return i18n.t('January');
      case 1:
        return i18n.t('February');
      case 2:
        return i18n.t('March');
      case 3:
        return i18n.t('April');
      case 4:
        return i18n.t('May');
      case 5:
        return i18n.t('June');
      case 6:
        return i18n.t('July');
      case 7:
        return i18n.t('August');
      case 8:
        return i18n.t('September');
      case 9:
        return i18n.t('Oktober');
      case 10:
        return i18n.t('November');
      case 11:
        return i18n.t('Dezember');
      default:
        return -1;
    }
  }

  /**
     * Convert MonthInt to a Month String
     * @param {String} hex - Hex code
     * @param {Double} opacity - opacity from 0-1
     * @return {String} Color with opacity
     */
  static addAlpha(color, opacity) {
    const op = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + op.toString(16).toUpperCase();
  }

  /**
     * Convert LatLon to Location
     * @param {Array} latlon - Latitude & Longitude
     * @return {String} Location as String
     */
  static async getLocationFromCoordinates(latlon) {
    // eslint-disable-next-line no-undef
    const geocodingClient = mbxGeocoding({
      accessToken: MAPBOX_TOKEN,
    });

    geocodingClient.reverseGeocode({
      query: latlon,
    })
      .send()
      .then((response) => {
        // const match = response.body.features[4].place_name;
        const match = response.body.features;
        console.log(match);
        return match;
      }).catch((e) => {
        console.error(e);
      })
      .finally(() => 'INVALID_REQUEST');
  }
}
