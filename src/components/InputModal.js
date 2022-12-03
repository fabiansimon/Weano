import {
  Modal, StyleSheet, View, TouchableOpacity, Animated, TextInput, Pressable, ActivityIndicator,
} from 'react-native';
import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntIcon from 'react-native-vector-icons/Entypo';
import { debounce } from 'lodash';
import { FlatList } from 'react-native-gesture-handler';
import KeyboardView from './KeyboardView';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import httpService from '../utils/httpService';
import Body from './typography/Body';
import i18n from '../utils/i18n';
import Divider from './Divider';

export default function InputModal({
  isVisible, onRequestClose, placeholder, onPress, geoMatching = false, ...rest
}) {
  const [showModal, setShowModal] = useState(isVisible);
  const [input, setInput] = useState('');
  const animatedBottom = useRef(new Animated.Value(900)).current;
  const duration = 300;

  const [suggestionData, setSuggestionData] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  useEffect(() => {
    if (!input) {
      setSuggestionData(null);
      setSuggestionsLoading(false);
    }
  }, [input]);

  const handleChangeText = (val) => {
    setInput(val);
    if (geoMatching) {
      delayedSearch(val);
    }
  };

  const delayedSearch = useCallback(
    debounce((val) => handleLocationQuery(val), 250),
    [],
  );

  const handleLocationQuery = async (val) => {
    if (val.trim().length < 2) {
      return;
    }

    setSuggestionsLoading(true);
    const res = await httpService.getLocationFromQuery(val).catch(() => setSuggestionsLoading(false));

    const sugg = res.features.map((feat) => ({
      string: feat.place_name,
      location: feat.center,
    }));

    setSuggestionData(sugg);
    setSuggestionsLoading(false);
  };

  const handleOnPress = () => {
    if (geoMatching) {
      onPress(suggestion);
    } else {
      onPress(input);
    }

    clearData();
  };

  const clearData = () => {
    setInput('');
    setSuggestion(null);
    setSuggestionData(null);
  };

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

  const toggleModal = () => {
    if (isVisible) {
      setShowModal(true);
      Animated.spring(animatedBottom, {
        toValue: 100,
        duration,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), duration);
      Animated.spring(animatedBottom, {
        toValue: 900,
        duration,
        useNativeDriver: true,
      }).start();
    }
  };

  const SuggestionTile = ({ item }) => (
    <Pressable
      onPress={() => {
        setInput(item.string);
        setSuggestion(item);
        setSuggestionData(null);
      }}
      style={styles.suggestionTile}
    >
      <EntIcon
        name="location-pin"
        color={COLORS.neutral[300]}
        size={20}
        style={{ marginRight: 6 }}
      />
      <Body
        type={1}
        color={COLORS.neutral[700]}
        text={item.string}
      />
    </Pressable>
  );

  return (
    <Modal
      animationType="fade"
      visible={showModal}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          onRequestClose();
          clearData();
        }}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', flex: 1 }}
      >
        <KeyboardView ignoreTouch>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: animatedBottom }] }]}>
            {((geoMatching && suggestionData) || (suggestionsLoading && suggestionData)) && (
            <View style={styles.suggestionsContainer}>
              {suggestionsLoading ? (
                <ActivityIndicator
                  style={{ marginVertical: 16 }}
                  color={COLORS.neutral[300]}
                />
              )
                : (
                  <FlatList
                    ListEmptyComponent={() => (
                      <Body
                        style={{ textAlign: 'center', marginVertical: 16 }}
                        text={i18n.t('No results')}
                        color={COLORS.neutral[300]}
                      />
                    )}
                    data={suggestionData}
                    ItemSeparatorComponent={() => (
                      <Divider
                        omitPadding
                        color={COLORS.neutral[50]}
                      />
                    )}
                    renderItem={({ item }) => <SuggestionTile item={item} />}
                  />
                )}
            </View>
            )}
            <View style={styles.innerContainer}>
              <TextInput
                {...rest}
                autoFocus
                value={input}
                onChangeText={(val) => handleChangeText(val)}
                style={styles.textInput}
                placeholderTextColor={COLORS.neutral[100]}
                placeholder={placeholder}
              />
              {input.length >= 1 && (
              <TouchableOpacity
                onPress={handleOnPress}
                activeOpacity={0.9}
                style={styles.button}
              >
                <Icon
                  color={COLORS.shades[0]}
                  name="plus"
                  size={22}
                />
              </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </KeyboardView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    maxHeight: '90%',
    marginTop: 'auto',
    shadowOffset: {
      height: -10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.05,
    shadowColor: COLORS.shades[100],
  },
  button: {
    borderRadius: 100,
    backgroundColor: COLORS.primary[700],
    width: 40,
    height: 40,
    marginBottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    marginTop: PADDING.l,
    letterSpacing: -1,
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[100],
    fontSize: 20,
  },
  innerContainer: {
    paddingHorizontal: PADDING.l,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: RADIUS.s,
    borderTopLeftRadius: RADIUS.s,
    backgroundColor: COLORS.shades[0],
    paddingBottom: 120,
  },
  suggestionsContainer: {
    bottom: -20,
    paddingBottom: 10,
    backgroundColor: COLORS.shades[0],
    shadowColor: COLORS.neutral[500],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    shadowOpacity: 0.05,
    shadowOffset: {
      y: 0,
      x: 0,
    },
  },
  suggestionTile: {
    minHeight: 55,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: PADDING.m,
  },
});
