import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Animated from 'react-native-reanimated';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import COLORS, {PADDING} from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import activeTripStore from '../../stores/ActiveTripStore';
import Utils from '../../utils';
import FAButton from '../../components/FAButton';
import userStore from '../../stores/UserStore';
import Body from '../../components/typography/Body';
import DELETE_DOCUMENT from '../../mutations/deleteDocument';
import UPLOAD_DOCUMENT from '../../mutations/uploadDocument';
import DocumentTile from '../../components/Trip/DocumentTile';
import httpService from '../../utils/httpService';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import PremiumController from '../../PremiumController';
import {KnownTypeNamesRule} from 'graphql';

const asyncStorageDAO = new AsyncStorageDAO();

export default function DocumentsScreen() {
  // MUTATIONS
  const [uploadDocument, {error: deleteError}] = useMutation(UPLOAD_DOCUMENT);
  const [deleteDocument, {error}] = useMutation(DELETE_DOCUMENT);

  // STORES
  const {
    documents,
    id: tripId,
    type,
    activeMembers,
  } = activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const {id, isProMember} = userStore(state => state.user);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);

  const {height} = Dimensions.get('window');

  useEffect(() => {
    if (error || deleteError) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error?.message || deleteError?.message,
        });
      }, 500);
    }
  }, [error, deleteError]);

  const handleDelete = ({_id}) => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Document'),
      i18n.t('Are you sure you want to delete this document?'),
      i18n.t('Yes'),
      async () => {
        await deleteDocument({
          variables: {
            data: {
              id: _id,
              tripId,
            },
          },
        })
          .then(() => {
            Toast.show({
              type: 'success',
              text1: i18n.t('Whooray!'),
              text2: i18n.t('Document was succeessfully deleted!'),
            });

            updateActiveTrip({
              documents: documents.filter(doc => doc._id !== _id),
            });
          })
          .catch(e => {
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

  const handleAddDocument = async () => {
    const usageLimit = JSON.parse(
      isProMember
        ? await asyncStorageDAO.getPremiumTierLimits()
        : await asyncStorageDAO.getFreeTierLimits(),
    ).documents;

    if (documents.filter(doc => doc.creatorId === id)?.length >= usageLimit) {
      return PremiumController.showModal(isProMember);
    }

    setIsLoading(true);

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const {type, name, size, uri} = res[0];

      if (size > 800000) {
        setIsLoading(false);
        return Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('This document is too big.'),
        });
      }
      if (type !== 'application/pdf') {
        setIsLoading(false);
        return Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('We only support PDF format for now.'),
        });
      }
      const {Location, Key} = await httpService.uploadToS3(null, null, uri);

      await uploadDocument({
        variables: {
          document: {
            type: 'application/pdf',
            uri: Location,
            tripId,
            title: name,
            s3Key: Key,
          },
        },
      })
        .then(r => {
          updateActiveTrip({documents: [...documents, r.data.uploadDocument]});
          setIsLoading(false);
        })
        .catch(e => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
          console.log(`ERROR: ${e.message}`);
          setIsLoading(false);
        });
    } catch (e) {
      setIsLoading(false);
      console.log(`ERROR: ${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Documents')}
        scrollY={scrollY}
        info={INFORMATION.documentScreen}>
        <View style={styles.innerContainer}>
          <FlatList
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: height * 0.65,
                  justifyContent: 'center',
                }}>
                <Body
                  type={1}
                  style={{alignSelf: 'center'}}
                  color={COLORS.shades[100]}
                  text={i18n.t('There are no documents yet 😕')}
                />
                <Body
                  type={2}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    width: '85%',
                    marginTop: 4,
                  }}
                  color={COLORS.neutral[300]}
                  text={i18n.t(
                    'Upload any important documents for this trip. Could be boarding passes, receipts etc.',
                  )}
                />
              </View>
            }
            data={documents}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 10,
                }}
              />
            )}
            renderItem={({item}) => {
              const isCreator = item.creatorId === id;
              const isDeletedUser = !activeMembers.find(
                member => member.id === item.creatorId,
              );

              const onPress =
                isCreator || isDeletedUser ? () => handleDelete(item) : null;

              return (
                <DocumentTile
                  style={{
                    paddingHorizontal: PADDING.m,
                    backgroundColor: COLORS.shades[0],
                  }}
                  onPress={() =>
                    Utils.openDocumentFromUrl(item.uri, item.title, true)
                  }
                  onDelete={onPress}
                  deleteEnabled={isCreator || isDeletedUser}
                  showMenu
                  data={item}
                />
              );
            }}
          />
        </View>
      </HybridHeader>
      <FAButton
        isDisabled={type === 'recent'}
        isLoading={isLoading}
        icon="add"
        iconSize={28}
        onPress={handleAddDocument}
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
    paddingTop: 10,
    paddingBottom: 120,
  },
});
