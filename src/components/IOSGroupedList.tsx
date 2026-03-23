import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

export interface IOSListItem {
  id: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  selected?: boolean;
  onPress?: () => void;
}

interface IOSGroupedListProps {
  items: IOSListItem[];
  style?: ViewStyle;
}

export const IOSGroupedList: React.FC<IOSGroupedListProps> = ({ items, style }) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.item,
            index > 0 && styles.itemBorder,
          ]}
          onPress={item.onPress}
          activeOpacity={item.onPress ? 0.5 : 1}
        >
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                {item.rightText && (
                  <Text style={styles.rightText}>{item.rightText}</Text>
                )}
              </View>
              {item.subtitle && (
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              )}
            </View>
            {item.selected ? (
              <View style={styles.checkmark}>
                <View style={styles.checkmarkCircle}>
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.chevron}>›</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    fontSize: 17,
    color: Colors.text,
  },
  rightText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    marginLeft: 12,
  },
  checkmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  chevron: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.2)',
    marginLeft: 12,
  },
});
