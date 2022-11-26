import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import BottomSheet from '@gorhom/bottom-sheet';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_TOKEN } from '@env';
import BackButton from '../components/BackButton';
import CountriesVisited from '../components/Map/CountriesVisited';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function MapScreen() {
  const snapPoints = useMemo(() => ['20%', '90%'], []);
  const sheetRef = useRef(null);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} />
      <BackButton style={styles.backButton} />
      <BottomSheet
        handleIndicatorStyle={{ opacity: 0 }}
        backgroundStyle={{
          backgroundColor: 'transparent',
          borderRadius: 20,
        }}
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onClose={() => {

        }}
      >
        <CountriesVisited />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
});
