import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {isEmpty} from 'lodash';
import COLORS from '../constants/Theme';
import DefaultAvatar from '../../assets/images/default_avatar.png';
import Headline from './typography/Headline';
// eslint-disable-next-line import/no-cycle
import ContactDetailModal from './ContactDetailModal';
import userStore from '../stores/UserStore';

export default function Avatar({
  style,
  size,
  data,
  onPress,
  backgroundColor,
  borderWidth,
  disabled,
  isSelf = false,
  avatarUri,
}) {
  // STORES
  const user = userStore(state => state.user);

  // STATE & MISC
  const [showDetails, setShowDetails] = useState(false);

  const info = avatarUri ? null : isSelf ? user : data;

  const hasAvatar = info?.avatarUri !== '' || avatarUri;

  const height = size || 55;
  const width = size || 55;
  const bg =
    backgroundColor || !hasAvatar ? COLORS.neutral[300] : COLORS.shades[0];
  const bW = borderWidth || 1;
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.container,
          style,
          {
            height,
            width,
            backgroundColor: bg,
            borderWidth: bW,
          },
        ]}
        onPress={() => (onPress ? onPress() : setShowDetails(true))}>
        {hasAvatar && (
          <Image
            source={DefaultAvatar}
            style={{height, width, position: 'absolute'}}
          />
        )}
        {hasAvatar && (
          <FastImage
            source={{uri: info?.avatarUri || avatarUri}}
            style={{height, width}}
          />
        )}
        {!hasAvatar && (
          <Headline
            type={4}
            text={`${info?.firstName[0]}${info?.lastName[0]}`}
            color={COLORS.shades[0]}
          />
        )}
      </TouchableOpacity>
      {!isEmpty(info) && (
        <ContactDetailModal
          isVisible={showDetails}
          onRequestClose={() => setShowDetails(false)}
          data={data}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.shades[0],
  },
});
