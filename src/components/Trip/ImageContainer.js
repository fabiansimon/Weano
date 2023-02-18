import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { MenuView } from '@react-native-menu/menu';
import RNFetchBlob from 'rn-fetch-blob';
import { useMutation } from '@apollo/client';
import COLORS, { RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Utils from '../../utils';
import DELETE_IMAGE from '../../mutations/deleteImage';
import userStore from '../../stores/UserStore';

export default function ImageContainer({
  style, image, onPress, tripId, onDelete,
}) {
  // MUTATIONS
  const [deleteImage] = useMutation(DELETE_IMAGE);

  // STORES
  const {
    id,
  } = userStore((state) => state.user);
  if (!image) {
    return;
  }

  const { uri } = image;

  const handleOption = ({ event }) => {
    if (event === 'download') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
      }).fetch('GET', uri).then((res) => {
        Utils.downloadImage(res.data);
      }).catch((e) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
      });
    }

    if (event === 'delete') {
      Utils.showConfirmationAlert(
        i18n.t('Remove Image'),
        i18n.t('Are you sure you want to delete and remove your image?'),
        i18n.t('Yes'),
        async () => {
          const { _id } = image;

          await deleteImage({
            variables: {
              data: {
                id: _id,
                tripId,
              },
            },
          }).then(() => {
            Toast.show({
              type: 'success',
              text1: i18n.t('Whooray!'),
              text2: i18n.t('Image was successfully deleted!'),
            });
            onDelete(image._id);
          })
            .catch((e) => {
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

  const actions = id === image.author._id ? [
    {
      id: 'download',
      title: i18n.t('Download picture'),
      image: Platform.select({
        ios: 'square.and.arrow.down',
      }),
    },
    {
      id: 'delete',
      title: i18n.t('Delete Image'),
      attributes: {
        destructive: true,
      },
      image: Platform.select({
        ios: 'trash',
      }),
    },
  ] : [
    {
      id: 'download',
      title: i18n.t('Download picture'),
      image: Platform.select({
        ios: 'square.and.arrow.down',
      }),
    },
  ];

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[styles.container, style]}
    >
      <MenuView
        style={styles.optionIcon}
        onPressAction={({ nativeEvent }) => handleOption(nativeEvent)}
        actions={actions}
      >
        <Pressable>
          <FeatherIcon
            name="more-vertical"
            color={COLORS.shades[0]}
            size={20}
          />
        </Pressable>
      </MenuView>
      <FastImage
        source={{ uri }}
        resizeMode="cover"
        style={styles.image}
      />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.46,
    aspectRatio: 9 / 16,
    borderRadius: RADIUS.s,
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
