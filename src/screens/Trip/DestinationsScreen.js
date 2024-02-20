import React, {useMemo, useRef, useState, useEffect, useCallback} from 'react';
import {Dimensions, Platform, Pressable, StyleSheet, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Toast from 'react-native-toast-message';
import bbox from '@turf/bbox';
import {lineString, lineString as makeLineString} from '@turf/helpers';
import BottomSheet from '@gorhom/bottom-sheet';
import {MAPBOX_TOKEN} from '@env';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSharedValue} from 'react-native-reanimated';
import {useMutation} from '@apollo/client';
import BackButton from '../../components/BackButton';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Utils from '../../utils';
import DestinationsSheet from '../../components/Trip/DestinationsSheet';
import InputModal from '../../components/InputModal';
import i18n from '../../utils/i18n';
import Subtitle from '../../components/typography/Subtitle';
import Body from '../../components/typography/Body';
import activeTripStore from '../../stores/ActiveTripStore';
import UPDATE_TRIP from '../../mutations/updateTrip';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CalendarModal from '../../components/CalendarModal';

MapboxGL.setAccessToken(MAPBOX_TOKEN);
const MAX_LENGTH = 15;

export default function DestinationScreen({navigatePage, isHost}) {
  // MUTATIONS
  const [updateTrip] = useMutation(UPDATE_TRIP);

  // STORES
  const {dateRange, destinations, id, activeMembers, title, type} =
    activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);

  // STATE && MISC
  const [inputData, setInputData] = useState({
    calendarVisible: false,
    inputVisible: false,
    dateRange: {
      startDate: 0,
      endDate: 0,
    },
    destination: {
      latlon: [],
      placeName: '',
    },
  });
  const [isReplace, setIsReplaced] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(false);

  const snapPoints = useMemo(() => ['35%', '100%'], []);

  const pageRef = useRef();
  const sheetRef = useRef(null);
  const mapCamera = useRef();
  const sheetPosition = useSharedValue(0);

  const destinationData = destinations.map((d, i) => ({
    ...d,
    key: i + 1,
  }));

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
    }, 500);
  }, [destinationData]);

  const handleSheetChanges = useCallback(i => {
    setExpandedIndex(i);
  }, []);

  const handleSheetTap = () =>
    sheetRef.current.snapToIndex(expandedIndex ? 0 : 1);

  const handleDeletion = index => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Trip stop?'),
      i18n.t('Are you sure you want to delete your this stop?'),
      i18n.t('Yes'),
      async () => {
        const oldData = destinations;

        const newArr = destinations.filter((item, i) => {
          if (i !== index) {
            return item;
          }
        });
        updateActiveTrip({destinations: newArr});
        handleUpdateTrip(oldData, newArr);
        sheetRef.current.snapToIndex(0);
      },
    );
  };

  const handleAddDestination = input => {
    if (!input) {
      return;
    }

    if (destinations.length >= MAX_LENGTH) {
      return;
    }

    let newArr;
    const oldData = destinations;

    if (isReplace) {
      newArr = [
        {
          latlon: input.location,
          placeName: input.string,
        },
      ];
      setIsReplaced(false);
    } else {
      newArr = [
        ...destinations,
        {
          latlon: input.location,
          placeName: input.string,
        },
      ];
    }

    updateActiveTrip({destinations: newArr});
    handleUpdateTrip(oldData, newArr);
    sheetRef.current.snapToIndex(0);
  };

  const updateData = data => {
    const oldData = destinations;

    updateActiveTrip({destinations: data});
    handleUpdateTrip(oldData, data);
  };

  const handleUpdateTrip = async (oldArr, newArr) => {
    await updateTrip({
      variables: {
        trip: {
          destinations: newArr.map(d => ({
            placeName: d.placeName,
            latlon: d.latlon,
          })),
          tripId: id,
        },
      },
    }).catch(e => {
      updateActiveTrip({destinations: oldArr});
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
      }, 500);
      console.log(e);
    });
  };

  const handleNavigation = () => {
    if (scrollIndex !== 0) {
      setScrollIndex(0);
      return pageRef.current?.scrollTo({x: 0});
    }

    if (expandedIndex !== 0) {
      setExpandedIndex(0);
      return sheetRef.current.snapToIndex(0);
    }

    return navigatePage(0);
  };

  const handlePan = () => {
    if (destinationData?.length <= 1) {
      mapCamera?.current?.setCamera({
        centerCoordinate: destinations[0].latlon,
        zoomLevel: 8,
        animationDuration: 500,
      });
      return;
    }

    const box = bbox(lineString(destinationData.map(item => item.latlon)));

    mapCamera?.current?.fitBounds(
      [box[0], box[1]],
      [box[2], box[3]],
      [30, 120],
      500,
    );
  };

  const renderBubble = (data, index) => {
    const {latlon} = data;
    if (latlon?.length < 2) {
      return;
    }

    return (
      <MapboxGL.MarkerView coordinate={latlon}>
        <View style={styles.numberContainer}>
          <Subtitle type={1} color={COLORS.shades[0]} text={index + 1} />
        </View>
      </MapboxGL.MarkerView>
    );
  };

  const renderLines = () => {
    if (destinationData?.length <= 1) {
      return;
    }
    const line = makeLineString(destinationData.map(item => item.latlon));
    if (!line) {
      return;
    }

    return (
      <MapboxGL.ShapeSource id="line" shape={line.geometry}>
        <MapboxGL.LineLayer id="lineLayer" style={shapeStyle.line} />
      </MapboxGL.ShapeSource>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <MapboxGL.MapView
          rotateEnabled={false}
          style={styles.map}
          styleURL="mapbox://styles/fabiansimon/clezrm6w7002g01p9eu1n0aos">
          <MapboxGL.Camera animationMode="moveTo" animated ref={mapCamera} />
          {destinationData &&
            destinationData.map((location, index) =>
              renderBubble(location, index),
            )}
          {renderLines()}
        </MapboxGL.MapView>
        <SafeAreaView edges={['top']} style={styles.header}>
          <BackButton
            icon={expandedIndex === 1 ? 'down' : 'arrowleft'}
            style={{marginBottom: Platform.OS === 'android' ? 10 : 0}}
            onPress={handleNavigation}
            isClear
          />
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              width: Dimensions.get('window').width,
              bottom: 6,
            }}>
            <Body
              type={1}
              style={{fontWeight: '500', textAlign: 'center'}}
              text={title}
            />
            <Body
              type={2}
              style={{textAlign: 'center'}}
              color={COLORS.neutral[300]}
              text={Utils.getDateRange(dateRange)}
            />
          </View>
        </SafeAreaView>
        <BottomSheet
          handleIndicatorStyle={{opacity: 0}}
          backgroundStyle={{
            backgroundColor: 'transparent',
            borderRadius: 20,
          }}
          onChange={i => handleSheetChanges(i)}
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          animatedPosition={sheetPosition}>
          <DestinationsSheet
            isHost={isHost}
            setScrollIndex={setScrollIndex}
            navigateRef={pageRef}
            sheetIndex={expandedIndex}
            dateRange={dateRange}
            onReplace={() => {
              setIsReplaced(true);
              setInputData(prev => {
                return {
                  ...prev,
                  inputVisible: true,
                };
              });
            }}
            amountPeople={activeMembers?.length}
            isRecent={type === 'recent'}
            handleExpending={handleSheetTap}
            position={sheetPosition}
            onAdd={() => {
              setInputData(prev => {
                return {
                  ...prev,
                  inputVisible: true,
                };
              });
            }}
            onDelete={index => handleDeletion(index)}
            onDragEnded={data => updateData(data)}
            destinations={destinationData}
          />
        </BottomSheet>
        <InputModal
          isVisible={inputData.inputVisible}
          geoMatching
          // trailingContent={
          //   <Pressable
          //     onPress={() => {
          //       setInputData(prev => {
          //         return {
          //           ...prev,
          //           inputVisible: false,
          //         };
          //       });
          //       setTimeout(() => {
          //         setInputData(prev => {
          //           return {
          //             ...prev,
          //             calendarVisible: true,
          //           };
          //         });
          //       }, 500);
          //     }}
          //     style={styles.dateContainer}>
          //     <Body
          //       type={2}
          //       text={
          //         !inputData?.dateRange.startDate
          //           ? i18n.t('From - To')
          //           : `${Utils.getDateFromTimestamp(
          //               inputData.dateRange.startDate,
          //               'MMM Do',
          //             )}`
          //       }
          //     />
          //   </Pressable>
          // }
          placeholder={i18n.t('Enter new destination')}
          onRequestClose={() => {
            setInputData(prev => {
              return {
                ...prev,
                inputVisible: false,
              };
            });
          }}
          onPress={input => handleAddDestination(input)}
        />
      </View>
      <CalendarModal
        minDate={false}
        isVisible={inputData.calendarVisible}
        onRequestClose={() =>
          setInputData(prev => {
            return {
              ...prev,
              calendarVisible: false,
              inputVisible: true,
            };
          })
        }
        onApplyClick={datesData => {
          const {
            end: {timestamp: endTimestamp},
            start: {timestamp: startTimestamp},
          } = datesData;
          setInputData(prev => {
            return {
              ...prev,
              inputVisible: true,
              calendarVisible: false,
              dateRange: {
                startDate: startTimestamp / 1000,
                endTimestamp: endTimestamp / 1000,
              },
            };
          });
        }}
      />
    </GestureHandlerRootView>
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
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: 10,
    shadowColor: COLORS.neutral[300],
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
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
    transform: [{rotate: '45deg'}],
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
  dateContainer: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
    marginRight: 6,
    paddingVertical: 8,
    top: 10,
    height: 35,
    paddingHorizontal: 10,
  },
});
