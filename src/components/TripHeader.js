import {View, StyleSheet, NativeModules, Platform} from 'react-native';
import React from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Headline from './typography/Headline';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Body from './typography/Body';
import TabBar from './Trip/TabBar';
import Divider from './Divider';
import i18n from '../utils/i18n';
import Label from './typography/Label';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {StatusBarManager} = NativeModules;

export default function TripHeader({
  style,
  title,
  subtitle,
  items,
  currentTab,
  onPress,
  isActive,
  isLoading,
}) {
  const getLoadingView = () => {
    return (
      <View style={{justifyContent: 'center'}}>
        <SkeletonPlaceholder.Item marginTop={8} flex={1}>
          <SkeletonPlaceholder
            speed={1400}
            backgroundColor={COLORS.neutral[100]}
            highlightColor={COLORS.neutral[50]}>
            <SkeletonPlaceholder.Item
              width={80}
              height={20}
              marginTop={4}
              marginLeft={15}
              borderRadius={RADIUS.s}
            />
            <SkeletonPlaceholder.Item
              marginTop={8}
              width={115}
              height={14}
              borderRadius={RADIUS.s}
            />
          </SkeletonPlaceholder>
        </SkeletonPlaceholder.Item>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={{width: 50}} />
        {isLoading ? (
          getLoadingView()
        ) : (
          <View>
            <Body
              type={1}
              text={title}
              style={{fontWeight: '600', textAlign: 'center'}}
            />
            {isActive ? (
              <Body
                type={2}
                style={{fontSize: 16, alignSelf: 'center', marginTop: 2}}
                text={i18n.t('• Live Trip')}
                color={COLORS.error[900]}
              />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <EntypoIcon
                  name="location-pin"
                  size={20}
                  color={COLORS.neutral[300]}
                />
                <Body
                  type={2}
                  style={{marginLeft: 2}}
                  text={subtitle || ''}
                  color={COLORS.neutral[300]}
                />
              </View>
            )}
          </View>
        )}
        <View style={{width: 50, height: 55}} />
      </View>
      <View>
        <Divider bottom={8} />
        <TabBar
          style={{marginBottom: 10}}
          items={items}
          currentTab={currentTab}
          onPress={index => onPress(index)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.shades[0],
    marginTop: StatusBarManager.HEIGHT - (Platform.OS === 'android' ? 30 : 15),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
