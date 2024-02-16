import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';
import userManagement from '../../utils/userManagement';
import i18n from '../../utils/i18n';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Checkbox from '../Checkbox';

export default function CheckboxTile({
  style,
  item,
  disableLabel,
  onPress,
  disabled = false,
  trailing,
  userList,
  isDense,
}) {
  const {isDone, assignee, title} = item;
  const user = userManagement.convertIdToUser(assignee, userList);

  const height = isDense ? 22 : 26;
  const width = isDense ? 22 : 26;

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        disabled={disabled}
        onPress={() => {
          onPress();
          RNReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true,
          });
        }}>
        <Checkbox style={{height, width}} isChecked={isDone} />
        <View
          style={{
            marginLeft: 4,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <View>
              {!disableLabel && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    color={isDone ? COLORS.success[700] : COLORS.neutral[300]}
                    name="person"
                  />
                  <Body
                    type={2}
                    text={user?.firstName || i18n.t('Deleted user')}
                    color={isDone ? COLORS.success[700] : COLORS.neutral[300]}
                    style={{marginLeft: 4}}
                  />
                </View>
              )}
            </View>
            <Body
              type={1}
              text={title}
              style={{textDecorationLine: isDone ? 'line-through' : 'none'}}
              color={isDone ? COLORS.success[700] : COLORS.shades[100]}
            />
          </View>
        </View>
      </Pressable>
      {!isDense && trailing && trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
