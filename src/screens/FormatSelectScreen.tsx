import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, PhotoFormat } from '../types';
import { Colors } from '../constants/colors';
import { IOSNavBar } from '../components/IOSNavBar';

type FormatSelectScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FormatSelect'
>;
type FormatSelectScreenRouteProp = RouteProp<RootStackParamList, 'FormatSelect'>;

interface Props {
  navigation: FormatSelectScreenNavigationProp;
  route: FormatSelectScreenRouteProp;
}

interface Format {
  id: string;
  name: string;
  size: string;
  desc: string;
}

const formats: Format[] = [
  { id: '1', name: '여권', size: '35×45mm', desc: '국제 표준 ICAO 규격' },
  { id: '2', name: '이력서', size: '3×4cm', desc: '한국 표준 이력서용' },
  { id: '3', name: '비자', size: '50×50mm', desc: '각국 비자 신청용' },
  { id: '4', name: '커스텀', size: '', desc: '직접 크기를 지정합니다' },
];

export const FormatSelectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri } = route.params;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNext = () => {
    const format = formats[selectedIndex];
    const selectedFormat: PhotoFormat = {
      id: format.id,
      name: format.name,
      width: format.size ? parseInt(format.size.split('×')[0]) : 35,
      height: format.size ? parseInt(format.size.split('×')[1].replace(/[^\d]/g, '')) : 45,
      unit: 'mm',
    };
    navigation.navigate('Result', { imageUri, format: selectedFormat });
  };

  return (
    <View style={styles.container}>
      <IOSNavBar
        leftLabel="뒤로"
        onBack={() => navigation.goBack()}
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Large title */}
        <View style={styles.header}>
          <Text style={styles.title}>규격 선택</Text>
        </View>

        {/* Photo preview */}
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
        </View>

        {/* Format list - iOS grouped style */}
        <View style={styles.formatsContainer}>
          <View style={styles.iosGroup}>
            {formats.map((format, index) => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatItem,
                  index > 0 && styles.formatItemBorder,
                ]}
                onPress={() => setSelectedIndex(index)}
                activeOpacity={0.5}
              >
                <View style={styles.formatContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.formatName}>{format.name}</Text>
                    {format.size && (
                      <Text style={styles.formatSize}>{format.size}</Text>
                    )}
                  </View>
                  <Text style={styles.formatDesc}>{format.desc}</Text>
                </View>
                {selectedIndex === index ? (
                  <View style={styles.checkmarkCircle}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                ) : (
                  <Text style={styles.chevron}>›</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  previewContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  preview: {
    width: 88,
    height: 114,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  formatsContainer: {
    paddingHorizontal: 16,
  },
  iosGroup: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  formatItemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  formatContent: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  formatName: {
    fontSize: 17,
    color: Colors.text,
  },
  formatSize: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  formatDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  chevron: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.2)',
    marginLeft: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 16,
    backgroundColor: Colors.background,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
