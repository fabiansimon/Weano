import {Dimensions, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import React, {useMemo, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import {useMutation} from '@apollo/client';
import i18n from '../../utils/i18n';
import Utils from '../../utils';
import DELETE_IMAGE from '../../mutations/deleteImage';
import Avatar from '../Avatar';
import ActionSheet from 'react-native-actionsheet';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

export default function ImageContainer({
  style,
  image,
  onPress,
  tripId,
  onDelete,
  cacheImage = false,
}) {
  // MUTATIONS
  const [deleteImage] = useMutation(DELETE_IMAGE);

  // STATES && MISC
  const sheetRef = useRef();

  if (!image) {
    return;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sheetOptions = useMemo(() => {
    let options = [i18n.t('Cancel'), i18n.t('Download')];

    if (onDelete) {
      options.push(i18n.t('Delete'));
    }

    return options;
  }, [onDelete]);

  const {uri, author} = image;

  const handleOption = index => {
    if (index === 1) {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
      })
        .fetch('GET', uri)
        .then(res => {
          Utils.downloadImage(res.data);
        })
        .catch(e => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
        });
    }

    if (index === 2) {
      Utils.showConfirmationAlert(
        i18n.t('Remove Image'),
        i18n.t('Are you sure you want to delete and remove your image?'),
        i18n.t('Yes'),
        async () => {
          const {_id} = image;

          await deleteImage({
            variables: {
              data: {
                id: _id,
                tripId,
              },
            },
          })
            .then(() => {
              Toast.show({
                type: 'success',
                text1: i18n.t('Whooray!'),
                text2: i18n.t('Image was successfully deleted!'),
              });
              onDelete(image._id);
            })
            .catch(e => {
              Toast.show({
                type: 'error',
                text1: i18n.t('Whoops!'),
                text2: e.message,
              });
              console.log(`ERROR: ${e.message}`);
            });
        },
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          RNReactNativeHapticFeedback.trigger('impactHeavy', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true,
          });
          sheetRef.current?.show();
        }}
        onPress={onPress}
        activeOpacity={0.5}
        style={[styles.container, style]}>
        {cacheImage ? (
          <FastImage source={{uri}} resizeMode="cover" style={styles.image} />
        ) : (
          <Image source={{uri}} resizeMode="cover" style={styles.image} />
        )}
        <Avatar
          size={26}
          avatarUri={author?.avatarUri}
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
          }}
        />
      </TouchableOpacity>
      <ActionSheet
        ref={sheetRef}
        title={i18n.t('Choose an option')}
        options={sheetOptions}
        cancelButtonIndex={0}
        destructiveButtonIndex={2}
        onPress={index => handleOption(index)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.318,
    aspectRatio: 9 / 16,
    borderRadius: 6,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  optionIcon: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 10,
    zIndex: 100,
    right: 0,
  },
});
