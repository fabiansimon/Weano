import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import COLORS, { RADIUS } from '../../constants/Theme';
import Headline from '../typography/Headline';

import Body from '../typography/Body';
import Utils from '../../utils';
import i18n from '../../utils/i18n';

export default function ExpenseTile({
  style, data, user, onPress,
}) {
  const getFullName = () => {
    if (user?.firstName) {
      return `${user?.firstName} ${user?.lastName}`;
    }

    return i18n.t('Deleted user');
  };
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={styles.initalContainer}>
        <Headline
          type={3}
          color={COLORS.neutral[300]}
          text={user?.firstName[0] || 'D'}
        />
      </View>
      <View style={{
        flexDirection: 'row', flex: 1, marginLeft: 15,
      }}
      >
        <View style={{ flex: 1 }}>
          <Headline
            type={4}
            numberOfLines={1}
            ellipsizeMode="tail"
            text={data.title}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={`${getFullName()}`}
          />
        </View>
        <View>
          <Headline
            type={4}
            style={{ textAlign: 'right' }}
            text={`$${data.amount}`}
          />
          <Body
            type={2}
            style={{ textAlign: 'right' }}
            color={COLORS.neutral[300]}
            text={Utils.getDateFromTimestamp(data.createdAt / 1000, 'DD.MM.YYYY • HH:mm')}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  initalContainer: {
    marginTop: 4,
    height: 35,
    width: 35,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
