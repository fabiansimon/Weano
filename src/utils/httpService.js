import 'react-native-get-random-values';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_KEY_ID, SECRET_ACCESS_KEY, S3_BUCKET, MAPBOX_TOKEN, APP_TOKEN,
  // eslint-disable-next-line import/no-unresolved
} from '@env';
import { S3 } from 'aws-sdk';
import { decode } from 'base64-arraybuffer';
import { readFile } from 'react-native-fs';
import META_DATA from '../constants/MetaData';

async function sendInvitations(invitees, tripId) {
  return new Promise((resolve, reject) => {
    fetch(`${META_DATA.baseUrl}/invite/${invitees}/${tripId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'App-Token': APP_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getVerificationCode(phoneNumber) {
  return new Promise((resolve, reject) => {
    fetch(`${META_DATA.baseUrl}/verify/${phoneNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'App-Token': APP_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function checkVerificationCode(phoneNumber, code) {
  return new Promise((resolve, reject) => {
    fetch(`${META_DATA.baseUrl}/check/${phoneNumber}/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'App-Token': APP_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// eslint-disable-next-line default-param-last
async function uploadToS3(image, transformToBase64 = false, document) {
  const key = uuidv4();

  const bucket = new S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    Bucket: S3_BUCKET,
    signatureVersion: 'v4',
  });

  let arrayBuffer;

  if (document) {
    const type = 'application/pdf';

    const base64 = await readFile(document, 'base64');
    arrayBuffer = decode(base64);

    // eslint-disable-next-line no-return-await
    return await bucket.upload({
      Bucket: S3_BUCKET,
      Key: `${key}/helloworld.pdf`,
      ContentDisposition: 'attachment',
      Body: arrayBuffer,
      ContentType: type,
    }).promise();
  }

  const type = 'image/jpeg';

  if (transformToBase64) {
    const path = image.uri;
    const base64 = await readFile(path, 'base64');
    arrayBuffer = decode(base64);
  } else {
    arrayBuffer = decode(image);
  }

  // eslint-disable-next-line no-return-await
  return await bucket.upload({
    Bucket: S3_BUCKET,
    Key: key,
    ContentDisposition: 'attachment',
    Body: arrayBuffer,
    ContentType: type,
  }).promise();
}

async function getLocationFromQuery(input) {
  const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const query = input
    .replace('ß', 'ss')
    .replace(/[^A-Za-z\-\s]+/g, '')
    .trim()
    .replace(' ', '%20'); input.trim();
  const limit = 2;

  if (query.length < 1) {
    return;
  }

  const queryUrl = `${baseUrl}${query}.json?limit=${limit}&types=place%2Ccountry&access_token=${MAPBOX_TOKEN}`;
  return new Promise((resolve, reject) => {
    fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  sendInvitations,
  uploadToS3,
  getVerificationCode,
  checkVerificationCode,
  getLocationFromQuery,
};
