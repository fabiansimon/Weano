import {
  View, StyleSheet, SectionList, Dimensions, Pressable,
} from 'react-native';
import React, {
  useEffect, useRef, useState,
} from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Entypo';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import CheckboxTile from '../../components/Trip/CheckboxTile';
import Body from '../../components/typography/Body';
import activeTripStore from '../../stores/ActiveTripStore';
import userStore from '../../stores/UserStore';
import Utils from '../../utils';
import FAButton from '../../components/FAButton';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import Headline from '../../components/typography/Headline';
import InputModal from '../../components/InputModal';
import SwipeView from '../../components/SwipeView';
import ADD_PACKING_LIST from '../../mutations/addPackingList';
import DELETE_PACKING_ITEM from '../../mutations/deletePackingitem';
import UPDATE_PACKING_ITEM from '../../mutations/updatePackingItem';
import PremiumController from '../../PremiumController';

const asyncStorageDAO = new AsyncStorageDAO();

export default function PacklistScreen() {
  // MUTATIONS
  const [addPackingList] = useMutation(ADD_PACKING_LIST);
  const [deletePackingItem] = useMutation(DELETE_PACKING_ITEM);
  const [updatePackingItem] = useMutation(UPDATE_PACKING_ITEM);

  // STORES
  const {
    packingItems, id: tripId,
  } = activeTripStore((state) => state.activeTrip);
  const { isProMember } = userStore((state) => state.user);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [packData, setPackData] = useState([]);

  const { height } = Dimensions.get('window');

  useEffect(() => {
    setPackData(
      [
        {
          title: i18n.t('Done'),
          data: packingItems.filter((item) => item.isPacked),
        },
        {
          title: i18n.t('Open'),
          data: packingItems.filter((item) => !item.isPacked),
        },
      ],
    );
  }, [packingItems]);

  const handleDeletion = (item) => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Packing Item'),
      i18n.t('Are you sure you want to delete your Packing Item?'),
      i18n.t('Yes'),
      async () => {
        const { _id } = item;

        await deletePackingItem({
          variables: {
            data: {
              id: _id,
              tripId,
            },
          },
        })
          .then(() => {
            updateActiveTrip({ packingItems: packingItems.filter((p) => p._id !== _id) });
          })
          .catch((e) => {
            Toast.show({
              type: 'error',
              text1: i18n.t('Whoops!'),
              text2: e.message,
            });
            console.log(`ERROR: ${e.message}`);
          });
      },
    );
  };

  const handleChange = async (data) => {
    if (!data) {
      return;
    }
    setIsVisible(false);

    const items = data.map((input) => {
      const amount = input.split(' ')[0].trim();
      const index = amount.length;
      const title = input.slice(index).trim();
      return {
        title,
        amount: parseInt(amount, 10),
      };
    });

    const usageLimit = JSON.parse(!isProMember ? await asyncStorageDAO.getPremiumTierLimits() : await asyncStorageDAO.getFreeTierLimits()).packingItems;
    if (packingItems.length + items.length > usageLimit) {
      setTimeout(() => {
        PremiumController.showModal();
      }, 300);
      return;
    }

    setIsLoading(true);

    await addPackingList({
      variables: {
        packingData: {
          items,
          tripId: '6407ab7ea1d242a3469e1da2',
        },
      },
    })
      .then((res) => {
        const newItems = res.data.createPackingList;

        if (packingItems?.length > 0) {
          updateActiveTrip({ packingItems: [...packingItems, ...newItems] });
        } else {
          updateActiveTrip({ packingItems: newItems });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      });
  };

  const handleUpdate = async (data, newAmount) => {
    if (newAmount === 0) {
      return;
    }

    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    });
    const { _id, isPacked, amount } = data;

    const oldData = packingItems;
    updateActiveTrip({

      packingItems: packingItems.map((item) => {
        if (item._id === _id) {
          const _amount = newAmount || item.amount;
          const _isPacked = newAmount ? item.isPacked : !item.isPacked;
          return {
            ...item,
            isPacked: _isPacked,
            amount: _amount,
          };
        }
        return item;
      }),
    });

    await updatePackingItem({
      variables: {
        data: {
          id: _id,
          isPacked: newAmount ? isPacked : !isPacked,
          amount: newAmount || amount,
        },
      },
    }).catch((e) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });

      updateActiveTrip({ packingItems: oldData });
      console.log(`ERROR: ${e.message}`);
    });
  };

  const getItem = (item) => {
    const { isPacked, amount } = item;
    return (
      <SwipeView onDelete={() => handleDeletion(item)}>
        <CheckboxTile
          style={{ paddingHorizontal: PADDING.xl, backgroundColor: COLORS.shades[0] }}
          trailing={(
            <View style={{
              flexDirection: 'row', alignItems: 'center',
            }}
            >
              <Pressable
                onPress={() => (amount <= 1 ? handleDeletion(item) : handleUpdate(item, amount - 1))}
                style={styles.counterContainer}
              >
                <Icon
                  name="minus"
                  size={16}
                  color={COLORS.neutral[700]}
                />
              </Pressable>
              <Headline
                style={{
                  marginHorizontal: 6, minWidth: 20, textAlign: 'center',
                }}
                type={4}
                text={amount}
              />
              <Pressable
                onPress={() => handleUpdate(item, amount + 1)}
                style={styles.counterContainer}
              >
                <Icon
                  name="plus"
                  size={16}
                  color={COLORS.neutral[700]}
                />
              </Pressable>
            </View>
        )}
          item={{
            ...item,
            isDone: isPacked,
          }}
          disableLabel
          onPress={() => handleUpdate(item)}
        />
      </SwipeView>
    );
  };

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Packlist')}
        scrollY={scrollY}
        info={INFORMATION.packlistScreen}
        scrollEnabled={false}
      >
        <SectionList
          style={{ paddingBottom: '100%' }}
          stickySectionHeadersEnabled
          sections={packData}
          ListEmptyComponent={(
            <View
              style={{
                flex: 1,
                height: height * 0.65,
                justifyContent: 'center',
              }}
            >
              <Body
                type={1}
                style={{ alignSelf: 'center' }}
                color={COLORS.shades[100]}
                text={i18n.t('There are no entries yet 😕')}
              />
              <Body
                type={2}
                style={{
                  alignSelf: 'center', textAlign: 'center', width: '85%', marginTop: 4,
                }}
                color={COLORS.neutral[300]}
                text={i18n.t('When the groups adds new polls, tasks, expenses or memories, they will be listed here.')}
              />
            </View>
              )}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => getItem(item)}
          renderSectionHeader={({ section: { title, data } }) => {
            const isEmpty = data?.length <= 0;
            const color = title === i18n.t('Done') ? COLORS.success[700] : COLORS.error[700];
            return (
              <>
                <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(color, 0.2) }]}>
                  <Body
                    type={2}
                    color={color}
                    style={{ fontWeight: '500' }}
                    text={title}
                  />
                </View>
                {isEmpty && (
                  <Body
                    style={{ marginLeft: PADDING.xl }}
                    type={2}
                    text={i18n.t('No open items')}
                    color={COLORS.neutral[300]}
                  />
                )}
              </>
            );
          }}
        />
      </HybridHeader>
      <InputModal
        maxLength={20}
        packingInput
        isVisible={isVisible}
        autoCorrect={false}
        multipleInputs
        placeholder={i18n.t('Add items to pack')}
        onRequestClose={() => setIsVisible(false)}
        onPress={(input) => handleChange(input)}
        autoClose
      />
      <FAButton
        isLoading={isLoading}
        icon="add"
        iconSize={28}
        onPress={() => setIsVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  titleContainer: {
    marginRight: 'auto',
    paddingVertical: 4,
    marginLeft: PADDING.l,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  counterContainer: {
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[100],
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
