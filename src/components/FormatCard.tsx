import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PhotoFormat } from '../types';
import { Colors } from '../constants/colors';

interface FormatCardProps {
  format: PhotoFormat;
  selected: boolean;
  onPress: () => void;
}

export const FormatCard: React.FC<FormatCardProps> = ({ format, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.title, selected && styles.selectedText]}>{format.name}</Text>
        <Text style={[styles.size, selected && styles.selectedText]}>
          {format.width} × {format.height} {format.unit}
        </Text>
        {format.description && (
          <Text style={[styles.description, selected && styles.selectedText]}>
            {format.description}
          </Text>
        )}
        {selected && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: Colors.gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightBlue,
  },
  content: {
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  size: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  selectedText: {
    color: Colors.primary,
  },
  checkmark: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
