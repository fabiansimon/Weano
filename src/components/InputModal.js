import {
  Modal, StyleSheet, View, TouchableOpacity, Animated, TextInput, Pressable, ActivityIndicator,
} from 'react-native';
import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntIcon from 'react-native-vector-icons/Entypo';
import { debounce } from 'lodash';
import { FlatList } from 'react-native-gesture-handler';
import AntIcon from 'react-native-vector-icons/AntDesign';
import KeyboardView from './KeyboardView';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import httpService from '../utils/httpService';
import Body from './typography/Body';
import i18n from '../utils/i18n';
import Divider from './Divider';
import toastConfig from '../constants/ToastConfig';
import REGEX from '../constants/Regex';

export default function InputModal({
  isVisible, onRequestClose, placeholder, onPress, geoMatching = false, topContent, emailInput, autoClose, multiline, maxLength, ...rest
}) {
  // STATE & MISC
  const [showModal, setShowModal] = useState(isVisible);
  const [input, setInput] = useState('');
  const [emailValues, setEmailValues] = useState([]);
  const [suggestionData, setSuggestionData] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const animatedBottom = useRef(new Animated.Value(900)).current;
  const duration = 300;

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

  const handleAdding = () => {
    const val = input.trim().toLowerCase();

    if (val.match(REGEX.email)) {
      setInput('');
      setEmailValues((prev) => [...prev, input]);
    } else {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: i18n.t('Not an email '),
      });
    }
  };

  const handleOnPress = () => {
    if (emailInput) {
      onPress(emailValues);
      clearData();
      return;
    }

    if (geoMatching) {
      onPress(suggestion);
      clearData();
      return;
    }

    onPress(input);
    clearData();
  };

  const clearData = () => {
    if (autoClose) {
      onRequestClose();
    }
    setInput('');
    setSuggestion(null);
    setSuggestionData(null);
    setEmailValues([]);
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

  const getSuggestionTile = (item) => (
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

  const getMultipleValuesContainer = () => (
    <View style={styles.wrapContainer}>
      {emailValues.map((value, index) => (
        <View style={styles.chip}>
          <Body
            type={1}
            color={COLORS.neutral[900]}
            text={value}
          />
          <AntIcon
            name="closecircle"
            color={COLORS.neutral[300]}
            size={18}
            style={{ marginLeft: 6 }}
            onPress={() => setEmailValues((prev) => prev.filter((_, i) => index !== i))}
            suppressHighlighting
          />
        </View>
      ))}
    </View>
  );

  const getCounter = () => {
    const isMax = input.length === maxLength;
    return (
      <View style={[styles.counter, { borderColor: isMax ? COLORS.error[900] : COLORS.neutral[100] }]}>
        <Body
          type={2}
          color={isMax ? COLORS.error[900] : COLORS.neutral[500]}
          text={`${input.length}/${maxLength}`}
        />
      </View>
    );
  };

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
        style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 1 }}
      >
        <KeyboardView
          behavior="padding"
          paddingBottom={0}
          ignoreTouch
        >
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
                    renderItem={({ item }) => getSuggestionTile(item)}
                  />
                )}
            </View>
            )}
            {emailInput && emailValues.length > 0 && getMultipleValuesContainer()}
            {topContent && !emailValues.length > 0 && !suggestionData && topContent}
            <View style={styles.innerContainer}>
              <TextInput
                {...rest}
                autoFocus
                maxLength={maxLength}
                multiline={multiline}
                value={input}
                onChangeText={(val) => handleChangeText(val)}
                style={styles.textInput}
                placeholderTextColor={COLORS.neutral[300]}
                placeholder={placeholder}
              />
              {(emailInput && input.length >= 1) && (
              <TouchableOpacity
                onPress={handleAdding}
                activeOpacity={0.9}
                style={styles.secondaryButton}
              >
                <Icon
                  color={COLORS.neutral[500]}
                  name="plus"
                  size={20}
                />
              </TouchableOpacity>
              )}
              {((emailInput && emailValues.length > 0) || (!emailInput && input.length >= 1)) && (
              <TouchableOpacity
                onPress={handleOnPress}
                activeOpacity={0.9}
                style={styles.button}
              >
                <Icon
                  color={COLORS.shades[0]}
                  name="check"
                  size={20}
                />
              </TouchableOpacity>
              )}
            </View>
            {maxLength && getCounter()}
          </Animated.View>
        </KeyboardView>
      </TouchableOpacity>
      <Toast config={toastConfig} />
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
    width: 35,
    height: 35,
    marginLeft: 6,
    marginBottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    borderRadius: 100,
    backgroundColor: COLORS.neutral[50],
    width: 35,
    height: 35,
    marginBottom: -20,
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    marginTop: PADDING.l,
    letterSpacing: -1,
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[100],
    fontSize: 18,
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
  wrapContainer: {
    bottom: -20,
    padding: 20,
    paddingHorizontal: 10,
    paddingTop: 8,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginTop: PADDING.s,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
    paddingVertical: 7,
    paddingHorizontal: 9,
  },
  counter: {
    position: 'absolute',
    top: -14,
    left: 20,
    backgroundColor: COLORS.shades[0],
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
