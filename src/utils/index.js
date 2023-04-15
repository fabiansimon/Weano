import 'react-native-get-random-values';
import moment from 'moment';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';

import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Toast from 'react-native-toast-message';
import Contacts from 'react-native-contacts';

import i18n from './i18n';

import META_DATA from '../constants/MetaData';

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
   * @param {String} date - Date
   * @return {Integer} Timestamp
   */
  static getDateRange(dateRange) {
    if (!dateRange) {
      return 'N/A';
    }
    const {startDate, endDate} = dateRange;

    const start = moment(new Date(startDate * 1000)).format('DD.MM.YY');
    const end = moment(new Date(endDate * 1000)).format('DD.MM.YY');

    return `${start} - ${end}`;
  }

  /**
   * Convert Date to UNIX timestamp
   * @param {Integer} date - Date
   * @return {boolean} isFuture
   */
  static checkIsFuture(startDate) {
    const today = Date.now();
    if (today > startDate * 1000) {
      return false;
    }
    return true;
  }

  /**
   * Show confirmation Alert
   * @param {String} title - Title
   * @param {String} subtitle - Subtitle
   * @param {String} action - action
   * @return {boolean} isFuture
   */
  static showConfirmationAlert(
    title,
    subtitle,
    actionMessage,
    action,
    isDestructive = true,
  ) {
    Alert.alert(title, subtitle, [
      {
        text: i18n.t('Cancel'),
        style: 'cancel',
      },
      {
        text: actionMessage,
        onPress: () => action(),
        style: isDestructive ? 'destructive' : 'default',
      },
    ]);
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
   * Add Alpha to Color
   * @param {String} hex - Hex code
   * @param {Double} opacity - opacity from 0-1
   * @return {String} Color with opacity
   */
  static addAlpha(color, opacity) {
    const op = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + op.toString(16).toUpperCase();
  }

  /**
   * Convert MonthInt to a Month String
   * @param {image} image - image to download
   */
  static async downloadImage(image, showToast = true) {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (!hasPermission) {
      return;
    }

    CameraRoll.save(image, {type: 'photo', album: 'Weano'});
    if (showToast) {
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: i18n.t('Done!'),
          text2: i18n.t('Image successfully saved on your device'),
        });
      }, 300);
    }
  }

  /**
   * Open Mail app with predefined email
   * @param {String} email - email
   */
  static openEmailApp() {
    const emailAddress = `mailto:${META_DATA.email}?cc=&subject=`;
    Linking.canOpenURL(emailAddress)
      .then(supported => {
        if (!supported) {
          Alert.alert(i18n.t('Not available'));
        } else {
          return Linking.openURL(emailAddress);
        }
      })
      .catch(err => console.log(err));
  }

  /**
   * Open phone number
   * @param {String} phoneNr - phoneNumber
   */
  static openPhoneNumber(phoneNr, firstName, lastName) {
    const contact = {
      familyName: lastName,
      givenName: firstName,
      phoneNumbers: [
        {
          label: 'mobile',
          number: phoneNr,
        },
      ],
    };
    try {
      Contacts.openContactForm(contact);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Open Document from an URL locally on the phone
   * @param {String} URL - URL
   */
  static openDocumentFromUrl(url, title) {
    const extension = url.split(/[#?]/)[0].split('.').pop().trim();

    const localFile = `${RNFS.DocumentDirectoryPath}/${title}.${extension}`;

    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .catch(error => {
        console.log(error);
        console.error(error);
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('Sorry something went wrong...'),
        });
      });
  }

  /**
   * Get days difference to trip
   * @param {Number} startDate - e.g. startDate of Trip
   * @param {Number} endDate - e.g. (optional) endDate of Trip
   * @param {Boolean} toAbs - if result should be shown as a positive integer
   */
  static getDaysDifference(startDate, endDate, toAbs = false) {
    if (!startDate) {
      return;
    }

    const toDate = moment(new Date(startDate * 1000));
    const fromDate = endDate
      ? moment(new Date(endDate * 1000)).startOf('day')
      : moment().startOf('day');

    const difference = Math.floor(
      moment.duration(toDate.diff(fromDate)).asDays(),
    );
    if (toAbs) {
      return Math.abs(difference);
    }

    return difference;
  }
}
