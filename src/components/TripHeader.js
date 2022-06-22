import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Headline from './typography/Headline';
import InfoCircle from './InfoCircle';
import COLORS from '../constants/Theme';
import Body from './typography/Body';
import TabBar from './Trip/TabBar';
import Divider from './Divider';

export default function TripHeader({
  style, title, subtitle, invitees, items, currentTab, onPress,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={{ width: 55 }} />
        <View>
          <Headline type={4} text={title} style={{ fontWeight: '600' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <EntypoIcon
              name="location-pin"
              size={16}
              color={COLORS.neutral[500]}
            />
            <Body
              type={2}
              text={subtitle}
              color={COLORS.neutral[500]}
            />
          </View>
        </View>
        <InfoCircle
          title={invitees.length}
          subtitle="👍"
          disableShadow
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
