import React from 'react';
import { format } from 'date-fns';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    display: 'flex',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 40,
  },
  subTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 14,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
});

export const PriceList = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={{ flexGrow: 1, marginTop: 140 }}>
          <Text style={styles.title}>R.G.T Restaurant Equipment</Text>
          <Text style={styles.subTitle}>
            {format(new Date(), 'MMMM, yyyy')} Price List
          </Text>
        </View>
        <View style={{ flexFlow: 1, marginBottom: 40 }}>
          <Text style={styles.footerText}>
            R.G.T Restaurant Equipment, Inc.
          </Text>
          <Text style={styles.footerText}>5 Executive Dr</Text>
          <Text style={styles.footerText}>Toms River, NJ, United States</Text>
          <Text style={styles.footerText}>+1 (908) 235-8986</Text>
        </View>
      </View>
    </Page>
  </Document>
);
