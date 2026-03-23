import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export const FaceGuide: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.oval} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oval: {
    width: width * 0.7,
    height: height * 0.5,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
});
