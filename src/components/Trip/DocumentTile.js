import {StyleSheet, TouchableHighlight, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Utils from '../../utils';
import Body from '../typography/Body';
import COLORS from '../../constants/Theme';
import SwipeView from '../SwipeView';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import userManagement from '../../utils/userManagement';
import i18n from '../../utils/i18n';

export default function DocumentTile({
  style,
  data,
  onPress,
  onDelete,
  deleteEnabled,
}) {
  if (!data) {
    return <View />;
  }
  const {createdAt, creatorId} = data;

  return (
    <SwipeView enabled={deleteEnabled} onPress={onDelete}>
      <View style={style}>
        <TouchableHighlight
          onPress={() => {
            onPress();
            RNReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: true,
            });
          }}
          underlayColor={COLORS.neutral[100]}
          style={styles.docContainer}>
          <>
            <View style={styles.iconContainer}>
              <Icon
                name="document-text"
                color={COLORS.primary[700]}
                size={22}
              />
            </View>
            <View style={{marginLeft: 8}}>
              <Body
                type={1}
                text={data.title}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{marginRight: 40}}
              />
              <Body
                type={2}
                text={`${i18n.t('by')} ${
                  userManagement.convertIdToUser(creatorId)?.firstName ||
                  i18n.t('deleted user')
                } • ${Utils.getDateFromTimestamp(
                  createdAt / 1000,
                  'DD/MM/YYYY',
                )}`}
                color={COLORS.neutral[300]}
              />
            </View>
          </>
        </TouchableHighlight>
      </View>
    </SwipeView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Utils.addAlpha(COLORS.primary[300], 0.2),
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    backgroundColor: COLORS.shades[0],
    alignItems: 'center',
  },
});
