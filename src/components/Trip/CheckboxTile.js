import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntIcon from 'react-native-vector-icons/Entypo';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';
import userManagement from '../../utils/userManagement';
import Avatar from '../Avatar';

export default function CheckboxTile({
  style, item, disableLabel, onPress, disabled = false, onMorePress, showMorePress = true,
}) {
  const { isDone, assignee, title } = item;
  const user = userManagement.convertIdToUser(assignee);

  const backgroundColor = isDone ? COLORS.success[700] : 'transparent';
  const borderWidth = isDone ? 0 : 1;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={[styles.checkbox, { backgroundColor, borderWidth }]}>
        <EntIcon name="check" color={COLORS.shades[0]} size={18} />
      </View>
      <View style={{
        marginLeft: 8, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      }}
      >
        <View>
          <View>
            {!disableLabel && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon color={isDone ? COLORS.success[700] : COLORS.neutral[300]} name="person" />
              <Body
                type={2}
                text={user?.firstName}
                color={isDone ? COLORS.success[700] : COLORS.neutral[300]}
                style={{ marginLeft: 4 }}
              />
            </View>
            )}
          </View>
          <Headline
            type={4}
            text={title}
            style={{ textDecorationLine: isDone ? 'line-through' : 'none' }}
            color={isDone ? COLORS.success[700] : COLORS.shades[100]}
          />
        </View>
        {onMorePress && showMorePress ? (
          <Pressable
            onPress={onMorePress}
            style={styles.addIcon}
          >
            <FeatherIcon
              name="more-vertical"
              size={20}
              color={COLORS.neutral[700]}
            />
          </Pressable>
        ) : (
          <Avatar
            disabled
            size={35}
            data={user}
          />
        )}
      </View>
    </Pressable>

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
    height: 26,
    width: 26,
    marginRight: 4,
  },
});
