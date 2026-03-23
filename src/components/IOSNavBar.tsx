import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface IOSNavBarProps {
  title?: string;
  leftLabel?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const IOSNavBar: React.FC<IOSNavBarProps> = ({
  title,
  leftLabel = '뒤로',
  onBack,
  rightElement,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.6}
          >
            <Text style={styles.chevron}>‹</Text>
            <Text style={styles.backLabel}>{leftLabel}</Text>
          </TouchableOpacity>
        )}
        {!onBack && <View style={styles.placeholder} />}
        
        {title && <Text style={styles.title}>{title}</Text>}
        
        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 56, // Status bar + spacing
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chevron: {
    fontSize: 32,
    fontWeight: '400',
    color: Colors.primary,
    marginRight: -4,
    marginTop: -2,
  },
  backLabel: {
    fontSize: 17,
    color: Colors.primary,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  placeholder: {
    width: 64,
  },
  rightElement: {
    paddingHorizontal: 12,
  },
});
