import { StyleSheet, View } from 'react-native';
import React from 'react';
import COLORS, { RADIUS } from '../../constants/Theme';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import Utils from '../../utils';

export default function ExpenseTile({ style, data, user }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.initalContainer}>
        <Headline
          type={3}
          color={COLORS.neutral[300]}
          text={user.name[0]}
        />
      </View>
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginLeft: 15,
      }}
      >
        <View>
          <Headline
            type={3}
            text={data.description}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={user.name}
          />
        </View>
        <View>
          <Headline
            type={3}
            style={{ textAlign: 'right' }}
            text={`$${data.amount}`}
          />
          <Body
            type={2}
            style={{ textAlign: 'right' }}
            color={COLORS.neutral[300]}
            text={Utils.getDateFromTimestamp(data.timestamp, 'DD.MM.YYYY • HH:mm')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
  },
  initalContainer: {
    marginTop: 4,
    height: 40,
    width: 40,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
