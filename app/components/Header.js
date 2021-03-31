import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function({}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>mySpeedCam Client App</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});