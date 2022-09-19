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
import Headline from '../typography/Headline';
import COLORS, { PADDING } from '../../constants/Theme';
import Body from '../typography/Body';
import TextField from '../TextField';
import Divider from '../Divider';

export default function AddPollModal({ isVisible, onRequestClose, onPress }) {
  const [inputFields, setInputFields] = useState([]);

  const inputData = [
    {
      title: i18n.t('Title'),
      placeholder: i18n.t('Ask a question'),
      value: '',
    },
    {
      title: i18n.t('Choice 1'),
      placeholder: i18n.t('Type your choice here'),
      value: '',
    },
    {
      title: i18n.t('Choice 2'),
      placeholder: i18n.t('Type your choice here'),
      value: '',
    },
  ];

  useEffect(() => {
    setInputFields(inputData);
  }, []);

  const addRow = () => {
    setInputFields((prev) => [...prev, {
      title: i18n.t(`${i18n.t('Choice')} ${prev.length}`),
      placeholder: i18n.t('Type your choice here'),
      value: '',
    }]);
  };

  const deleteRow = (index) => {
    setInputFields((prev) => {
      const newArr = prev;
      newArr.splice(index, 1);
    });
  };

  const getInputRow = (field, index) => (
    <View style={{ marginBottom: 10 }}>
      <Body
        type={2}
        style={{ marginBottom: 10 }}
        text={field.title}
        color={COLORS.neutral[500]}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextField
          value={field.value || null}
          onChangeText={(val) => setInputFields((prev) => {
            const newArr = prev;
            newArr[index].val = val;
            return newArr;
          })}
          placeholder={field.placeholder}
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
            <TouchableOpacity
              onPress={addRow}
              style={styles.addButton}
            >
              <Headline
                type={4}
                text={i18n.t('Add choice')}
                color={COLORS.primary[700]}
              />
              <Icon
                name="plus"
                color={COLORS.primary[700]}
                size={20}
              />
            </TouchableOpacity>
            <View style={{ marginBottom: 100 }} />
          </ScrollView>
          <Button
            fullWidth
            style={styles.button}
            text={i18n.t('Send Poll')}
            onPress={() => {
            //   onPress({ amount, description });
            //   onRequestClose();
              console.log(inputFields);
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
