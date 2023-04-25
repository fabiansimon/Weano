import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import COLORS, {PADDING} from '../../constants/Theme';
import Utils from '../../utils';
import DocumentTile from './DocumentTile';
import i18n from '../../utils/i18n';
import EmptyDataContainer from '../EmptyDataContainer';
import ROUTES from '../../constants/Routes';
import Divider from '../Divider';
import Body from '../typography/Body';

const MAX_LENGTH = 3;

export default function DocumentsContainer({style, data}) {
  const navigation = useNavigation();
  if (data.length <= 0) {
    return (
      <EmptyDataContainer
        style={{marginTop: -6}}
        title={i18n.t('There are no documents to show yet.')}
        subtitle={i18n.t('Be the first one to add one.')}
        route={ROUTES.documentsScreen}
      />
    );
  }
  return (
    <Pressable
      onPress={() => navigation.push(ROUTES.documentsScreen)}
      style={[styles.container, style]}>
      {data.map((doc, index) => {
        if (index >= MAX_LENGTH) {
          return;
        }
        return (
          <DocumentTile
            deleteEnabled={false}
            style={{marginTop: index !== 0 ? 14 : 0}}
            data={doc}
            onPress={() => Utils.openDocumentFromUrl(doc.uri, doc.title)}
          />
        );
      })}
      {data?.length > MAX_LENGTH && (
        <View>
          <Divider
            style={{
              marginHorizontal: -6,
            }}
            color={COLORS.neutral[100]}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            style={{marginBottom: 6, alignSelf: 'center'}}
            text={`+ ${data.length - MAX_LENGTH} ${i18n.t('more items')}`}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: PADDING.l,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
    padding: 6,
  },
});
