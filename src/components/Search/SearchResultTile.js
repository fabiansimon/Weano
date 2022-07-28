import { StyleSheet, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import TagContainer from '../TagContainer';
import i18n from '../../utils/i18n';
import Utils from '../../utils';

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
          style={{ marginBottom: 5 }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="location-on"
            size={18}
            color={COLORS.neutral[500]}
          />
          <Headline
            type={4}
            text="Paris, France"
            color={COLORS.neutral[500]}
          />
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Headline
          type={4}
          text={Utils.getDateFromTimestamp(data.dateRange.startDate, 'MMMM yyyy')}
          color={COLORS.neutral[500]}
          style={{ marginBottom: 5 }}
        />
        <TagContainer
          text={isFuture ? i18n.t('upcoming') : i18n.t('successful')}
          color={isFuture ? COLORS.primary[300] : COLORS.success[500]}
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
