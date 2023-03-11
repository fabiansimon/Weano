import React, {
  useMemo, useRef, useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Dimensions,
  StyleSheet, View,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import bbox from '@turf/bbox';
import { lineString, lineString as makeLineString } from '@turf/helpers';
import BottomSheet from '@gorhom/bottom-sheet';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_TOKEN } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import BackButton from '../../components/BackButton';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Utils from '../../utils';
import DestinationsSheet from '../../components/Trip/DestinationsSheet';
import InputModal from '../../components/InputModal';
import i18n from '../../utils/i18n';
import Subtitle from '../../components/typography/Subtitle';
import Body from '../../components/typography/Body';
import activeTripStore from '../../stores/ActiveTripStore';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function DestinationScreen() {
  // STORES
  const { dateRange } = activeTripStore((state) => state.activeTrip);

  // STATE & MISC
  const mockData = [
    {
      placeName: 'Mexico City, Mexico',
      latlon: [-99.14638745694221, 19.39181444946778],
      key: 1,
    },
    {
      placeName: 'Chiapas, Mexico',
      latlon: [-91.59616923105648, 16.56027299510734],
      key: 2,
    },
    {
      placeName: 'Bacalar, Mexico',
      latlon: [-88.39089899276608, 18.679654560505313],
      key: 3,
    },
  ];

  // STATE && MISC
  const [inputVisible, setInputVisible] = useState(false);
  const [destinationData, setDestinationData] = useState(mockData);
  const snapPoints = useMemo(() => ['33%', '100%'], []);
  const [expandedIndex, setExpandedIndex] = useState(0);

  const sheetRef = useRef(null);
  const mapCamera = useRef();
  const sheetPosition = useSharedValue(0);

  const shapeStyle = {
    line: {
      lineColor: COLORS.primary[700],
      lineWidth: 2,
      lineGapWidth: 0,
      lineDasharray: [2, 2],
      lineOpacity: 1,
    },
  };

  useEffect(() => {
    setTimeout(() => {
      handlePan();
    }, 100);
  }, [destinationData]);

  const handleSheetChanges = useCallback((i) => {
    setExpandedIndex(i);
  }, []);

  const handleSheetTap = () => sheetRef.current.snapToIndex(expandedIndex ? 0 : 1);

  const handleDeletion = (index) => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Trip stop?'),
      i18n.t('Are you sure you want to delete your this stop?'),
      i18n.t('Yes'),
      async () => {
        // eslint-disable-next-line array-callback-return
        setDestinationData((prev) => prev.filter((item, i) => {
          if (i !== index) {
            return item;
          }
        }));
      },
    );
    // eslint-disable-next-line array-callback-return
  };

  const handleAddDestination = (input) => {
    if (!input) {
      return;
    }
    sheetRef.current.snapToIndex(0);
    setInputVisible(false);
    setDestinationData((prev) => [...prev, {
      latlon: input.location,
      placeName: input.string,
      key: prev.length + 1,
    }]);
  };

  const handlePan = () => {
    const box = bbox(lineString(destinationData.map((item) => item.latlon)));

    mapCamera.current.fitBounds(
      [box[0], box[1]],
      [box[2], box[3]],
      30,
      100,
    );
  };

  const renderBubble = (data, index) => {
    const { latlon } = data;

    if (latlon?.length < 2) {
      return;
    }

    return (
      <MapboxGL.MarkerView
        coordinate={latlon}
      >
        <View style={styles.numberContainer}>
          <Subtitle
            type={1}
            color={COLORS.shades[0]}
            text={index + 1}
          />
        </View>
      </MapboxGL.MarkerView>
    );
  };

  const renderLines = () => {
    const line = makeLineString(destinationData.map((item) => item.latlon));
    if (!line) {
      return;
    }

    return (
      <MapboxGL.ShapeSource
        id="line"
        shape={line.geometry}
      >
        <MapboxGL.LineLayer
          id="lineLayer"
          style={shapeStyle.line}
        />
      </MapboxGL.ShapeSource>
    );
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        rotateEnabled={false}
        style={styles.map}
        styleURL="mapbox://styles/fabiansimon/clezrm6w7002g01p9eu1n0aos"
      >
        <MapboxGL.Camera
          animationMode="moveTo"
          animated
          ref={mapCamera}
        />
        {destinationData && destinationData.map((location, index) => renderBubble(location, index))}
        {renderLines()}
      </MapboxGL.MapView>
      <SafeAreaView edges={['top']} style={styles.header}>
        <BackButton
          isClear
        />
        <View style={{
          position: 'absolute', alignItems: 'center', width: Dimensions.get('window').width, bottom: 6,
        }}
        >
          <Body
            type={1}
            style={{ fontWeight: '500', textAlign: 'center' }}
            text={i18n.t('Destinations')}
          />
          <Body
            type={2}
            style={{ textAlign: 'center' }}
            color={COLORS.neutral[300]}
            text={Utils.getDateRange(dateRange)}
          />
        </View>
      </SafeAreaView>
      <BottomSheet
        handleIndicatorStyle={{ opacity: 0 }}
        backgroundStyle={{
          backgroundColor: 'transparent',
          borderRadius: 20,
        }}
        onChange={(i) => handleSheetChanges(i)}
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        animatedPosition={sheetPosition}
      >
        <DestinationsSheet
          onPress={handleSheetTap}
          position={sheetPosition}
          onAdd={() => setInputVisible(true)}
          onDelete={(index) => handleDeletion(index)}
          onDragEnded={(data) => setDestinationData(data)}
          destinations={destinationData}
        />
      </BottomSheet>
      <InputModal
        isVisible={inputVisible}
        geoMatching
        placeholder={i18n.t('Enter new destination')}
        onRequestClose={() => setInputVisible(false)}
        onPress={(input) => handleAddDestination(input)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    alignItems: 'flex-end',
    backgroundColor: COLORS.shades[0],
    paddingHorizontal: PADDING.m,
    zIndex: 2,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: COLORS.neutral[300],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

  },
  container: {
    width: '100%',
    height: '100%',
  },
  map: {
    backgroundColor: COLORS.shades[0],
    flex: 1,
  },
  pinShape: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.shades[0],
    borderRadius: 2,
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    transform: [{ rotate: '45deg' }],
  },
  imageContainer: {
    padding: 4,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.m,
    shadowColor: COLORS.neutral[900],
    shadowOffset: {
      x: 0,
      y: 20,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  tabSelector: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    right: PADDING.l,
    top: 65,
    height: 40,
    borderRadius: RADIUS.xl,
    backgroundColor: Utils.addAlpha(COLORS.primary[900], 0.2),
    borderWidth: 1,
    borderColor: COLORS.primary[700],
    position: 'absolute',
  },
  tab: {
    width: 120,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    margin: -1,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
  },
  searchButton: {
    borderWidth: 1,
    height: 45,
    width: 45,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.shades[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberContainer: {
    backgroundColor: COLORS.primary[700],
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
  },
});
