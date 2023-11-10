import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';

export default function TimelineSkeleton() {
  const {width} = Dimensions.get('window');

  return (
    <View>
      <SkeletonPlaceholder.Item
        marginTop={8}
        marginHorizontal={PADDING.m}
        flex={1}>
        <SkeletonPlaceholder
          speed={1400}
          backgroundColor={COLORS.neutral[100]}
          highlightColor={COLORS.neutral[50]}>
          <SkeletonPlaceholder.Item
            width={140}
            height={30}
            marginTop={12}
            borderRadius={RADIUS.s}
          />
          <SkeletonPlaceholder.Item
            marginTop={18}
            marginLeft={PADDING.xl}
            marginBottom={12}
            width={width * 0.8}
            height={70}
            borderRadius={RADIUS.s}
          />
          <SkeletonPlaceholder.Item
            marginTop={8}
            marginLeft={PADDING.xl}
            marginBottom={12}
            width={width * 0.8}
            height={70}
            borderRadius={RADIUS.s}
          />
          <SkeletonPlaceholder.Item
            width={140}
            height={30}
            marginTop={12}
            borderRadius={RADIUS.s}
          />
          <SkeletonPlaceholder.Item
            marginTop={18}
            marginLeft={PADDING.xl}
            marginBottom={12}
            width={width * 0.8}
            height={70}
            borderRadius={RADIUS.s}
          />
          <SkeletonPlaceholder.Item
            marginTop={8}
            marginLeft={PADDING.xl}
            marginBottom={12}
            width={width * 0.8}
            height={70}
            borderRadius={RADIUS.s}
          />
        </SkeletonPlaceholder>
      </SkeletonPlaceholder.Item>
    </View>
  );
}
