import {
  Pressable,
  StyleSheet, View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING } from '../../constants/Theme';
import Utils from '../../utils';
import i18n from '../../utils/i18n';
import EmptyDataContainer from '../EmptyDataContainer';
import ROUTES from '../../constants/Routes';
import CheckboxTile from './CheckboxTile';
import Body from '../typography/Body';

export default function PacklistContainer({ style, data }) {
  const navigation = useNavigation();
  if (!data || data.length <= 0) {
    return (
      <EmptyDataContainer
        style={{ marginTop: -6, marginHorizontal: -7 }}
        title={i18n.t('There are no open packing items to show.')}
        subtitle={i18n.t("Let's go add one.")}
        route={ROUTES.packlistScreen}
      />
    );
  }
  return (
    <Pressable
      onPress={() => navigation.navigate(ROUTES.packlistScreen)}
      style={[styles.container, style]}
    >
      <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(COLORS.error[700], 0.2) }]}>
        <Body
          type={2}
          color={COLORS.error[700]}
          style={{ fontWeight: '500' }}
          text={i18n.t('Open items to pack')}
        />
      </View>
      {data.map((item) => (
        <CheckboxTile
          trailing={<Body color={COLORS.neutral[500]} type={1} text={`${item.amount}x`} />}
          disabled
          style={{ paddingHorizontal: PADDING.m, marginVertical: -4 }}
          item={item}
          disableLabel
        />
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginHorizontal: -4,
    borderRadius: 14,
    paddingBottom: 4,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
  titleContainer: {
    marginRight: 'auto',
    paddingVertical: 4,
    marginLeft: PADDING.s,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
});
