import {
  Platform,
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntIcon from 'react-native-vector-icons/Entypo';

import { MenuView } from '@react-native-menu/menu';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';
import userManagement from '../../utils/userManagement';
import Avatar from '../Avatar';
import i18n from '../../utils/i18n';

export default function CheckboxTile({
  style, item, disableLabel, onPress, disabled = false, onMorePress, showMorePress = true, userList, isDense, isCreator,
}) {
  const {
    isDone, assignee, title, isPrivate,
  } = item;
  const user = userManagement.convertIdToUser(assignee, userList);

  const backgroundColor = isDone ? COLORS.success[700] : 'transparent';
  const borderWidth = isDone ? 0 : 1;

  const height = isDense ? 22 : 26;
  const width = isDense ? 22 : 26;

  const actions = isPrivate ? [
    {
      id: 'delete',
      attributes: {
        destructive: true,
      },
      title: i18n.t('Delete Task'),
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    },
  ] : isCreator ? [
    {
      id: 'reminder',
      title: `${i18n.t('Remind')} ${user?.firstName}`,

    },
    {
      id: 'delete',
      attributes: {
        destructive: true,
      },
      title: i18n.t('Delete Task'),
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    },
  ] : [
    {
      id: 'reminder',
      title: `${i18n.t('Remind')} ${user?.firstName}`,

    },
  ];

  return (
    <View
      style={[styles.container, style]}
    >
      <Pressable
        style={{
          flex: 1, flexDirection: 'row', alignItems: 'center',
        }}
        disabled={disabled}
        onPress={() => {
          onPress();
          ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true,
          });
        }}
      >
        <View style={[styles.checkbox, {
          backgroundColor, borderWidth, height, width,
        }]}
        >
          <EntIcon name="check" color={COLORS.shades[0]} size={18} />
        </View>
        <View style={{
          marginLeft: 8,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          <View>
            <View>
              {!disableLabel && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon color={isDone ? COLORS.success[700] : COLORS.neutral[300]} name="person" />
                <Body
                  type={2}
                  text={user?.firstName || i18n.t('Private')}
                  color={isDone ? COLORS.success[700] : COLORS.neutral[300]}
                  style={{ marginLeft: 4 }}
                />
              </View>
              )}
            </View>
            <Body
              type={1}
              text={title}
              style={{ textDecorationLine: isDone ? 'line-through' : 'none' }}
              color={isDone ? COLORS.success[700] : COLORS.shades[100]}
            />
          </View>
        </View>
      </Pressable>

      {!isDense && (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {onMorePress && showMorePress ? (
            <MenuView
              style={styles.addIcon}
              onPressAction={({ nativeEvent }) => onMorePress(nativeEvent)}
              actions={actions}
            >
              <FeatherIcon
                name="more-vertical"
                size={20}
                color={COLORS.neutral[700]}
              />
            </MenuView>
          ) : (
            item.assignee && (
            <Avatar
              disabled
              size={35}
              data={user}
            />
            )
          )}
        </>
      )}
    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderColor: COLORS.neutral[300],
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  addIcon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    height: 35,
    width: 35,
  },
});
