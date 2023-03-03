import {
  Platform, StyleSheet, TouchableHighlight, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { MenuView } from '@react-native-menu/menu';
import Utils from '../../utils';
import Body from '../typography/Body';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';

export default function DocumentTile({
  style, data, onPress, onDelete, showMenu = false,
}) {
  if (!data) {
    return <View />;
  }
  const { createdAt } = data;

  const _getTile = () => (
    <TouchableHighlight
      onPress={() => {
        onPress();
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: true,
        });
      }}
      underlayColor={COLORS.neutral[100]}
      style={[styles.docContainer, style]}
    >
      <>
        <View style={styles.iconContainer}>
          <Icon
            name="document-text"
            color={COLORS.primary[700]}
            size={22}
          />
        </View>
        <View style={{ marginLeft: 8 }}>
          <Body
            type={1}
            text={data.title}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginRight: 40 }}
          />
          <Body
            type={2}
            text={Utils.getDateFromTimestamp(createdAt / 1000, 'HH:mm DD/MM/YYYY ')}
            color={COLORS.neutral[300]}
          />
        </View>
      </>
    </TouchableHighlight>
  );

  if (!showMenu) {
    return _getTile();
  }

  return (
    <MenuView
      style={styles.addIcon}
      shouldOpenOnLongPress
      onPressAction={({ nativeEvent }) => onDelete(nativeEvent)}
      actions={[
        {
          id: 'delete',
          attributes: {
            destructive: true,
            disabled: !onDelete,
          },
          title: i18n.t('Delete Document'),
          image: Platform.select({
            ios: 'trash',
            android: 'ic_menu_delete',
          }),
        },
      ]}
    >
      {_getTile()}
    </MenuView>
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
    alignItems: 'center',
  },
});
