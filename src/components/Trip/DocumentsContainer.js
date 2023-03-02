import {
  StyleSheet, View,
} from 'react-native';
import React from 'react';
import COLORS, { PADDING } from '../../constants/Theme';
import Utils from '../../utils';
import DocumentTile from './DocumentTile';
import Body from '../typography/Body';
import i18n from '../../utils/i18n';

export default function DocumentsContainer({ style, data }) {
  return (
    <View style={[styles.container, style]}>
      {
        data && data.length > 0 ? data.map((doc, index) => (
          <DocumentTile
            style={{ marginTop: index !== 0 && 14 }}
            data={doc}
            onPress={() => Utils.openDocumentFromUrl(doc.uri, doc.title)}
          />
        )) : (
          <Body
            style={{ alignSelf: 'center', marginVertical: 6 }}
            type={2}
            color={COLORS.neutral[300]}
            text={i18n.t('No documents to show 🥱')}
          />
        )
      }
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
