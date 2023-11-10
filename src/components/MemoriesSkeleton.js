import React from 'react';
import {View} from 'react-native';
import {Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import COLORS from '../constants/Theme';

export default function MemoriesSkeleton() {
  const {width} = Dimensions.get('window');
  const IMAGE_HEIGHT = 200;
  const IMAGE_WIDTH = width * 0.317;
  return (
    <View>
      <SkeletonPlaceholder.Item marginHorizontal={5} width={width}>
        <SkeletonPlaceholder
          speed={1400}
          width={width}
          backgroundColor={COLORS.neutral[700]}
          highlightColor={COLORS.neutral[900]}>
          <SkeletonPlaceholder.Item
            width={width}
            flexDirection="row"
            height={IMAGE_HEIGHT}
            marginTop={12}
            borderRadius={6}>
            <SkeletonPlaceholder.Item
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              borderRadius={6}
            />
            <SkeletonPlaceholder.Item
              width={IMAGE_WIDTH}
              marginLeft={4}
              marginRight={4}
              height={IMAGE_HEIGHT}
              borderRadius={6}
            />
            <SkeletonPlaceholder.Item
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              borderRadius={6}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder
          speed={1400}
          width={width}
          backgroundColor={COLORS.neutral[700]}
          highlightColor={COLORS.neutral[900]}>
          <SkeletonPlaceholder.Item
            width={width}
            flexDirection="row"
            height={IMAGE_HEIGHT}
            marginTop={4}
            borderRadius={6}>
            <SkeletonPlaceholder.Item
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              borderRadius={6}
            />
            <SkeletonPlaceholder.Item
              width={IMAGE_WIDTH}
              marginLeft={4}
              marginRight={4}
              height={IMAGE_HEIGHT}
              borderRadius={6}
            />
            <SkeletonPlaceholder.Item
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              borderRadius={6}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </SkeletonPlaceholder.Item>
    </View>
  );
}
