import {
  StyleSheet, View,
} from 'react-native';
import React from 'react';
import COLORS, { PADDING } from '../../constants/Theme';
import Utils from '../../utils';
import DocumentTile from './DocumentTile';
import i18n from '../../utils/i18n';
import EmptyDataContainer from '../EmptyDataContainer';
import ROUTES from '../../constants/Routes';

export default function DocumentsContainer({ style, data }) {
  if (data.length <= 0) {
    return (
      <EmptyDataContainer
        style={{ marginTop: -6 }}
        title={i18n.t('There are no documents to show yet.')}
        subtitle={i18n.t('Be the first one to add one.')}
        route={ROUTES.documentsScreen}
      />
    );
  }
  return (
    <View style={[styles.container, style]}>
      {data.map((doc, index) => (
        <DocumentTile
          deleteEnabled={false}
          style={{ marginTop: index !== 0 && 14 }}
          data={doc}
          onPress={() => Utils.openDocumentFromUrl(doc.uri, doc.title)}
        />
      ))}
    </View>
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
