import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function({label, onClick}) {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'center'
  }
});