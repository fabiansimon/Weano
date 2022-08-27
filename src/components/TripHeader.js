import { View, StyleSheet } from 'react-native';
import React from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';
import Body from './typography/Body';
import TabBar from './Trip/TabBar';
import Divider from './Divider';
import Button from './Button';

export default function TripHeader({
  style, title, subtitle, items, currentTab, onPress,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={{ width: 50 }} />
        <View>
          <Headline type={4} text={title} style={{ fontWeight: '600' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <EntypoIcon
              name="location-pin"
              size={16}
              color={COLORS.neutral[300]}
            />
            <Body
              type={2}
              text={subtitle}
              color={COLORS.neutral[300]}
            />
          </View>
        </View>
        <Button
          isSecondary
          style={styles.moreButton}
          icon={<Ionicon name="ios-chatbubbles-outline" size={22} />}
          fullWidth={false}
          color={COLORS.neutral[900]}
          // onPress={() => (onPress ? onPress() : navigation.goBack())}
        />
      </View>
      <View>
        <Divider bottom={8} />
        <TabBar
          style={{ marginBottom: 10 }}
          items={items}
          currentTab={currentTab}
          onPress={(index) => onPress(index)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  moreButton: {
    marginTop: 7,
  },
  container: {
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
