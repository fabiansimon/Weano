import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import Headline from './typography/Headline';
import COLORS, {PADDING} from '../constants/Theme';
import PopUpModal from './PopUpModal';
import i18n from '../utils/i18n';
import Body from './typography/Body';

export default function BasicHeader({
  style,
  title,
  subtitle,
  trailing,
  children,
  info,
  centerComponent,
}) {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <View
      style={[styles.container, style, {paddingBottom: children ? 14 : 14}]}>
      <SafeAreaView />
      <View style={styles.heading}>
        <View style={[styles.titleContainer, {marginBottom: children && 16}]}>
          <Headline type={4} style={{fontWeight: '500'}} text={title} />
          {centerComponent && centerComponent}
          {info && !trailing && (
            <Icon
              onPress={() => setInfoVisible(true)}
              suppressHighlighting
              name="info-with-circle"
              size={20}
              color={COLORS.neutral[100]}
            />
          )}
          {trailing || null}
        </View>
        {subtitle && (
          <Body type={1} text={subtitle} color={COLORS.neutral[300]} />
        )}
      </View>
      {children}
      <PopUpModal
        isVisible={infoVisible}
        title={i18n.t('Info')}
        subtitle={info}
        onRequestClose={() => setInfoVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.shades[0],
    width: '100%',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[50],
  },
  titleContainer: {
    marginTop: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heading: {
    paddingHorizontal: PADDING.l,
    marginTop: -30,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
