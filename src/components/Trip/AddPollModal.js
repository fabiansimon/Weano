import {
  Pressable,
  ScrollView, StyleSheet, View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { TextInput } from 'react-native-gesture-handler';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import i18n from '../../utils/i18n';
import COLORS, { PADDING } from '../../constants/Theme';
import Body from '../typography/Body';

export default function AddPollModal({
  isVisible, onRequestClose, onPress, isLoading,
}) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setTitle('');
    setOptions([]);
  }, [isVisible]);

  const handleInput = (val, index) => {
    setOptions((prev) => {
      const newArr = [...prev];
      newArr[index] = val;

      return newArr;
    });
  };

  const addOption = () => {
    setOptions((prev) => {
      const newArr = [...prev];
      newArr.push('');
      return newArr;
    });
  };

  const deleteRow = (index) => {
    setOptions((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const getOptionsContainer = () => {
    const borderTopLeftRadius = !options.length && 10;
    const borderTopRightRadius = !options.length && 10;
    const borderBottomLeftRadius = 10;
    const borderBottomRightRadius = 10;

    const showAddTile = options[options.length - 1] !== '';

    return (
      <View style={{ marginBottom: 30 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15,
        }}
        >
          <Body
            type={1}
            style={{ fontWeight: '500', marginRight: 6 }}
            color={COLORS.neutral[700]}
            text={i18n.t('Options')}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={i18n.t('(max. 5 options)')}
          />
        </View>
        {options.map((option, index) => {
          const isEmpty = option === '';

          return (
            <View style={[styles.optionContainer, {
              // eslint-disable-next-line max-len
              borderTopRightRadius: !index && 10, borderTopLeftRadius: !index && 10, borderBottomLeftRadius: (isEmpty && !showAddTile) ? 10 : 0, borderBottomRightRadius: (isEmpty && !showAddTile) ? 10 : 0,
            }]}
            >
              <TextInput
                onChangeText={(val) => handleInput(val, index)}
                value={option}
                autoFocus
                style={styles.optionInput}
                placeholderTextColor={COLORS.neutral[300]}
                placeholder={i18n.t('Add another')}
              />
              {!isEmpty && (
              <Pressable
                onPress={() => deleteRow(index)}
                style={styles.deleteIcon}
              >
                <Icon
                  name="close"
                  color={COLORS.neutral[500]}
                  size={18}
                />
              </Pressable>
              )}
            </View>
          );
        })}
        {showAddTile && (
        <Pressable
          onPress={addOption}
          style={[styles.optionContainer, {
            borderBottomRightRadius, borderBottomLeftRadius, borderTopLeftRadius, borderTopRightRadius,
          }]}
        >
          <Body
            type={1}
            style={{ marginLeft: 15 }}
            color={COLORS.neutral[300]}
            text={i18n.t('Add another')}
          />
        </Pressable>
        )}
      </View>
    );
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add Poll')}
      actionLabel={i18n.t('Create')}
      onPress={() => onPress({ title, options })}
      isLoading={isLoading}
      isDisabled={title.trim().length <= 0 || options.length <= 0}
    >
      <KeyboardView>
        <ScrollView style={{ marginBottom: 100 }}>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row', marginVertical: 20, width: '90%' }}>
              <TextInput
                onChangeText={(val) => setTitle(val)}
                style={styles.titleInput}
                value={title}
                placeholderTextColor={COLORS.neutral[300]}
                placeholder={i18n.t('Add a title for the poll')}
              />
            </View>

            {getOptionsContainer()}
          </View>
        </ScrollView>
      </KeyboardView>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: PADDING.l,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'WorkSans-Regular',
    letterSpacing: -1,
    height: 60,
  },
  optionContainer: {
    marginTop: -1,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  optionInput: {
    height: 50,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'WorkSans-Regular',
    letterSpacing: -1,
    marginLeft: 15,
    width: '80%',
  },
  deleteIcon: {
    height: 50,
    width: 50,
    borderLeftColor: COLORS.neutral[100],
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
});
