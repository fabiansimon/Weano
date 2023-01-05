import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/Feather';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';
import Utils from '../../utils';

export default function CheckboxTile({
  style, item, disableLabel, onPress, disabled = false, onMorePress,
}) {
  return (
    <BouncyCheckbox
      size={22}
      style={style}
      disabled={disabled}
      textComponent={(
        <View style={{
          marginLeft: 8, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        }}
        >
          <View>
            <View>
              {!disableLabel && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon color={item.isDone ? COLORS.success[700] : COLORS.neutral[300]} name="person" />
                  <Body
                    type={2}
                    text={Utils.convertIdToUser(item.assignee)}
                    color={item.isDone ? COLORS.success[700] : COLORS.neutral[300]}
                    style={{ marginLeft: 4 }}
                  />
                </View>
              )}
            </View>
            <Headline
              type={4}
              text={item.title}
              style={{ textDecorationLine: item.isDone ? 'line-through' : 'none' }}
              color={item.isDone ? COLORS.success[700] : COLORS.shades[100]}
            />
          </View>
          {onMorePress && (
          <Pressable
            onPress={onMorePress}
            style={styles.addIcon}
          >
            <AntIcon
              name="more-vertical"
              size={20}
              color={COLORS.neutral[700]}
            />
          </Pressable>
          )}
        </View>
        )}
      fillColor={COLORS.success[700]}
      accessibilityElementsHidden
      iconStyle={{
        borderRadius: 6,
        borderColor: COLORS.neutral[700],
      }}
      onPress={(isChecked) => onPress(isChecked)}
    />

  );
}

const styles = StyleSheet.create({
  addIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
});
