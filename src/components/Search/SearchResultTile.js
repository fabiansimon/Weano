import { StyleSheet, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import TagContainer from '../TagContainer';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';

export default function SearchResultTile({ data }) {
  const checkIsFuture = () => {
    const today = Date.now();
    if (today > data.dateRange.startDate * 1000) return false;
    return true;
  };

  const isFuture = checkIsFuture();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.container}
    >
      <View>
        <Headline
          type={4}
          text={data.title}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="location-on"
            size={12}
            color={COLORS.neutral[300]}
          />
          <Body
            type={1}
            text="Paris, France"
            color={COLORS.neutral[300]}
          />
        </View>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <TagContainer
          text={isFuture ? i18n.t('upcoming') : i18n.t('successful')}
          backgroundColor={isFuture ? COLORS.error[100] : COLORS.success[300]}
          textColor={isFuture ? COLORS.error[700] : COLORS.success[900]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
});
