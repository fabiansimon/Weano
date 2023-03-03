import {
  View, StyleSheet, TouchableOpacity, Pressable, Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import FeatherIcon from 'react-native-vector-icons/Feather';
import COLORS, { PADDING } from '../constants/Theme';
import i18n from '../utils/i18n';
import HybridHeader from '../components/HybridHeader';
import INFORMATION from '../constants/Information';
import Headline from '../components/typography/Headline';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import ROUTES from '../constants/Routes';
import DELETE_USER from '../mutations/deleteUserAccount';
import Utils from '../utils';
import userStore from '../stores/UserStore';
import UPDATE_USER from '../mutations/updateUser';
import Body from '../components/typography/Body';
import InputModal from '../components/InputModal';
import REGEX from '../constants/Regex';

const asyncStorageDAO = new AsyncStorageDAO();

export default function MyAccountScreen() {
  // MUTATIONS
  const [updateUser, { error }] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  // STORES
  const {
    firstName, lastName, email, phoneNumber,
  } = userStore((state) => state.user);
  const updateUserState = userStore((state) => state.updateUserData);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [inputState, setInputState] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
    }
  }, [error]);

  const handleDeleteAccount = () => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Account'),
      i18n.t('Are you sure you want to delete your Account?'),
      i18n.t('Delete'),
      async () => {
        deleteUser();
        await asyncStorageDAO.clearAccessToken();
        navigation.navigate(ROUTES.initDataCrossroads);
      },
    );
  };

  const handleInput = async (input) => {
    const { state } = inputState;
    const trimmedInput = input.trim();
    const updatedUser = {};

    const check = checkInput(trimmedInput);

    if (!check) {
      return;
    }

    if (state === 'firstName') {
      updatedUser.firstName = trimmedInput;
    }
    if (state === 'lastName') {
      updatedUser.lastName = trimmedInput;
    }
    if (state === 'email') {
      updatedUser.email = trimmedInput;
    }
    if (state === 'phoneNumber') {
      updatedUser.phoneNumber = trimmedInput;
    }

    try {
      await updateUser({
        variables: {
          user: updatedUser,
        },
      }).catch((e) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        setInputState(null);
      }).then(() => {
        updateUserData(input);
        setInputState(null);
      });
      Toast.show({
        type: 'success',
        text1: i18n.t('Great!'),
        text2: i18n.t('Successfully updated'),
      });
    } catch (e) {
      setInputState(null);
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
    }
  };

  const checkInput = (input) => {
    const { state } = inputState;

    if (state === 'firstName' || state === 'lastName') {
      const check = !REGEX.name.test(input);

      if (!check) {
        setInputState(null);

        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('Not a valid name'),
        });
      }
      return check;
    }

    if (state === 'email') {
      const check = !!input.toLowerCase().match(REGEX.email);

      if (!check) {
        setInputState(null);

        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('Not a valid email'),
        });
      }
      return check;
    }

    return true;
  };

  const updateUserData = (data) => {
    const { state } = inputState;

    switch (state) {
      case 'firstName':
        updateUserState({ firstName: data });
        break;
      case 'lastName':
        updateUserState({ lastName: data });
        break;
      case 'email':
        updateUserState({ email: data });
        break;
      case 'phoneNumber':
        updateUserState({ phoneNumber: data });
        break;

      default:
        break;
    }
  };

  const InputField = ({
    title, value, onPress, style,
  }) => (
    <Pressable style={style} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Body
          type={1}
          text={title}
          color={COLORS.neutral[900]}
        />
        <FeatherIcon
          name="edit"
          style={{ marginLeft: 6 }}
          color={COLORS.neutral[300]}
        />
      </View>
      <Headline
        style={{ marginHeight: 10 }}
        type={2}
        text={value}
        color={COLORS.neutral[900]}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Your info')}
        subtitle={i18n.t('To edit your data, just tap on it')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <InputField
                style={{ flex: 1 }}
                title={i18n.t('First Name')}
                value={firstName}
                onPress={() => setInputState({
                  placeholder: firstName,
                  state: 'firstName',
                  keyboardType: 'default',
                })}
              />
              <InputField
                style={{ flex: 1 }}
                title={i18n.t('Surname')}
                value={lastName}
                onPress={() => setInputState({
                  placeholder: lastName,
                  state: 'lastName',
                  keyboardType: 'default',
                })}
              />
            </View>
            <InputField
              style={{ marginTop: 30 }}
              title={i18n.t('Email')}
              value={email}
              onPress={() => setInputState({
                placeholder: email,
                state: 'email',
                keyboardType: 'email-address',
              })}
            />
            <InputField
              style={{ marginTop: 30 }}
              title={i18n.t('Phone number')}
              value={phoneNumber}
              onPress={() => setInputState({
                placeholder: phoneNumber,
                state: 'phoneNumber',
                keyboardType: 'phone-pad',
              })}
            />
          </View>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <IonIcon
              name="ios-trash-outline"
              color={COLORS.error[900]}
              size={22}
            />
            <Headline
              style={{ marginLeft: 8 }}
              color={COLORS.error[900]}
              text={i18n.t('Delete Account')}
              type={4}
            />
          </TouchableOpacity>
        </View>
      </HybridHeader>
      <InputModal
        maxLength={(inputState?.state === 'firstName' || inputState?.state === 'lastName') && 15}
        isVisible={inputState}
        initalValue={inputState?.placeholder}
        onRequestClose={() => setInputState(null)}
        onPress={(input) => handleInput(input)}
        keyboardType={inputState?.keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  innerContainer: {
    justifyContent: 'space-between',
    marginTop: 20,
    flex: 1,
    height: Dimensions.get('window').height * 0.70,
    marginHorizontal: PADDING.l,
  },

});
