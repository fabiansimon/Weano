import React from 'react';
import {Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import COLORS, {RADIUS} from '../constants/Theme';

const {width} = Dimensions.get('window');
export default function InvitationScreenSkeleton() {
  return (
    <SkeletonPlaceholder.Item marginTop={8} flex={1}>
      <SkeletonPlaceholder
        speed={1400}
        backgroundColor={COLORS.neutral[100]}
        highlightColor={COLORS.neutral[50]}>
        <SkeletonPlaceholder.Item
          width={140}
          height={30}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item
          width={140}
          height={20}
          marginTop={10}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item
          width={width * 0.89}
          height={250}
          marginTop={40}
          borderRadius={RADIUS.s}
        />
      </SkeletonPlaceholder>
    </SkeletonPlaceholder.Item>
  );
}
