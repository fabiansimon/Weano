import moment from 'moment';

export default class Utils {
  /**
     * Format UNIX Timestamp to MMM Do (YY) date
     * @param {Number} timestamp - UNIX Timestamp
     * @param {Boolean} suffix - including YY in format
     * @return {String} Nicely formatted Date
     */
  static getDateFromTimestamp(timestamp, suffix) {
    const date = new Date(timestamp * 1000);
    return moment(date).format(`MMM Do ${suffix ? 'YY' : ''}`);
  }
}
