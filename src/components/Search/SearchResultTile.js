import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';

export default function SearchResultTile({ style, data }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.container, style]}
    >
      <View>
        <Headline
          type={4}
          text={data.title}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Body
            type={1}
            text="Paris, France • 26.12.2022"
            color={COLORS.neutral[300]}
          />
        </View>
      </View>
      <View style={styles.chevronContainer}>
        <Icon
          name="chevron-small-right"
          size={24}
          color={COLORS.neutral[300]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chevronContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[50],
    height: 30,
    width: 30,
  },
});
