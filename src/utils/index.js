/* eslint-disable import/no-extraneous-dependencies */
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'base64-arraybuffer';
import moment from 'moment';
import { readFile } from 'react-native-fs';
// eslint-disable-next-line import/no-unresolved
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, S3_BUCKET } from '@env';
import { S3 } from 'aws-sdk';
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
     * Convert MonthInt to a Month String
     * @param {Dynamic} image - Image from expo camera module
     * @return {String} aws image.uri
     */
  static async uploadToS3(image) {
    const key = uuidv4();

    console.log(key);

    const bucket = new S3({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      Bucket: S3_BUCKET,
      signatureVersion: 'v4',
    });

    const type = 'image/jpeg';
    const path = image.uri;
    const base64 = await readFile(path, 'base64');
    const arrayBuffer = decode(base64);

    const data = await bucket.upload({
      Bucket: S3_BUCKET,
      Key: key,
      ContentDisposition: 'attachment',
      Body: arrayBuffer,
      ContentType: type,
    }).promise();

    console.log(data);
  }

  /**
     * Convert LatLon to Location
     * @param {Array} latlon - Latitude & Longitude
     * @return {String} Location as String
     */
  static async getLocationFromCoordinates(latlon) {
    const geocodingClient = mbxGeocoding({
      accessToken: 'pk.eyJ1IjoiZmFiaWFuc2ltb24iLCJhIjoiY2w0c3g4OGE0MDk4MDNlcGg0MHY4aWV1aiJ9.easvfaRgYjcC3tV6C4Vz6w',
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
