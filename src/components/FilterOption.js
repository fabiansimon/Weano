import {
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';
import FilterModal from './FilterModal';

export default function FilterOption({ style, data }) {
  // STATE & MISC
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Headline
          type={4}
          text={data.title}
          style={{ marginRight: 4 }}
          color={COLORS.neutral[500]}
        />
        <Icon
          name="chevron-down"
          size={20}
          color={COLORS.neutral[500]}
        />
      </TouchableOpacity>
      <FilterModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        onPress={(f) => console.log(f)}
        data={data}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 12,
    height: 40,
    borderWidth: 1,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
  },
});
