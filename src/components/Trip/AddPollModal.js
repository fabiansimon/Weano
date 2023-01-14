import {
  ScrollView, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import Button from '../Button';
import i18n from '../../utils/i18n';
import COLORS, { PADDING } from '../../constants/Theme';
import Body from '../typography/Body';
import TextField from '../TextField';
import Divider from '../Divider';

export default function AddPollModal({
  isVisible, onRequestClose, onPress, isLoading,
}) {
  const [inputFields, setInputFields] = useState([]);

  const inputData = [
    {
      title: i18n.t('Title'),
      placeholder: i18n.t('Ask a question'),
      value: '',
    },
    {
      placeholder: i18n.t('Type your choice here'),
      value: '',
    },
    {
      placeholder: i18n.t('Type your choice here'),
      value: '',
    },
  ];

  useEffect(() => {
    setInputFields(inputData);
  }, []);

  const addRow = () => {
    setInputFields((prev) => [...prev,
      {
        placeholder: i18n.t('Type your choice here'),
        value: '',
      },
    ]);
  };

  const deleteRow = (i) => {
    setInputFields((prev) => prev.filter((_, index) => index !== i));
  };

  const getInputRow = (field, index) => {
    const { title, placeholder, value } = field;
    return (
      <View style={{ marginBottom: 10 }}>
        {title && (
        <Body
          type={2}
          style={{ marginBottom: 10 }}
          text={title}
          color={COLORS.neutral[500]}
        />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextField
            value={value || null}
            onChangeText={(val) => setInputFields((prev) => {
              const newArr = prev;
              newArr[index].value = val;
              return newArr;
            })}
            showTrailingIcon={false}
            placeholder={placeholder}
            style={{
              backgroundColor: COLORS.neutral[50],
              borderColor: COLORS.neutral[100],
              borderWidth: 1,
              marginBottom: 10,
              flex: 1,
            }}
          />
          {index !== 0 && (
          <AntIcon
            onPress={() => deleteRow(index)}
            name="close"
            suppressHighlighting
            color={COLORS.neutral[300]}
            size={20}
            style={{ marginBottom: 6, marginLeft: 8 }}
          />
          )}
        </View>
        {index === 0 && <Divider />}
      </View>
    );
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add Poll')}
    >
      <KeyboardView paddingBottom={50}>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: 16 }}
          >
            {inputFields.map((field, index) => getInputRow(field, index))}
            {inputFields.length < 5 && (
            <TouchableOpacity
              onPress={addRow}
              style={styles.addButton}
            >
              <Body
                type={1}
                text={i18n.t('Add choice')}
                color={COLORS.primary[700]}
              />
              <Icon
                name="plus"
                color={COLORS.primary[700]}
                size={20}
              />
            </TouchableOpacity>
            )}
            <View style={{ marginBottom: 200 }} />
          </ScrollView>
          <Button
            fullWidth
            style={styles.button}
            isLoading={isLoading}
            text={i18n.t('Add Poll')}
            onPress={() => {
              onPress(inputFields);
              setInputFields(inputData);
              onRequestClose();
            }}
          />
        </View>
      </KeyboardView>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  container: {
    flex: 1,
    marginHorizontal: PADDING.m,
    marginBottom: PADDING.xl,
  },
});
