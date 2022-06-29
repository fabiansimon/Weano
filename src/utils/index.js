/* eslint-disable import/no-extraneous-dependencies */
import moment from 'moment';

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
     * Convert Date to UNIX timestamp
     * @param {String} date - Date
     * @return {Integer} Timestamp
     */
  static convertDateToTimestamp(date) {
    const formatedDate = moment(date).format();
    return moment(formatedDate).format('X');
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
