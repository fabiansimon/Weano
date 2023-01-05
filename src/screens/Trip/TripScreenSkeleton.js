import React from 'react';
import { Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import COLORS, { RADIUS } from '../../constants/Theme';

export default function TripScreenSkeleton() {
  const { width } = Dimensions.get('window');

  return (

    <SkeletonPlaceholder.Item
      marginTop={8}
      flex={1}
    >
      <SkeletonPlaceholder
        speed={1400}
        backgroundColor={COLORS.neutral[100]}
        highlightColor={COLORS.neutral[50]}
      >
        <SkeletonPlaceholder.Item
          width={140}
          height={40}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item flexDirection="row" marginVertical={10}>
          <SkeletonPlaceholder.Item
            width={width * 0.42}
            height={44}
            marginTop={12}
            borderRadius={RADIUS.xl}
          />
          <SkeletonPlaceholder.Item
            width={width * 0.42}
            height={44}
            marginLeft={12}
            marginTop={12}
            borderRadius={RADIUS.xl}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={240}
          height={30}
          marginTop={12}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item
          marginTop={30}
          marginBottom={12}
          width={100}
          height={30}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item flexDirection="row">
          <SkeletonPlaceholder.Item
            width={100}
            height={100}
            borderRadius={RADIUS.s}
          />
          <SkeletonPlaceholder.Item
            width={100}
            height={100}
            marginLeft={12}
            borderRadius={RADIUS.s}
          />
          <SkeletonPlaceholder.Item
            width={100}
            height={100}
            marginLeft={12}
            borderRadius={RADIUS.s}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={120}
          height={30}
          marginTop={36}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item
          width="100%"
          height={64 * 2}
          borderRadius={10}
          marginTop={14}
        />
        <SkeletonPlaceholder.Item
          width={120}
          height={30}
          marginTop={36}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item
          width="100%"
          height={64 * 2}
          borderRadius={10}
          marginTop={14}
        />
        <SkeletonPlaceholder.Item
          width={120}
          height={30}
          marginTop={36}
          borderRadius={RADIUS.s}
        />
        <SkeletonPlaceholder.Item
          width="100%"
          height={64 * 2}
          borderRadius={10}
          marginTop={14}
        />
      </SkeletonPlaceholder>
    </SkeletonPlaceholder.Item>
  );
}
