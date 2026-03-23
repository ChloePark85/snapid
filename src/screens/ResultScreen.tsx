import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/colors';
import { IOSNavBar } from '../components/IOSNavBar';
import { supabase } from '../lib/supabase';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface Props {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

interface BgOption {
  label: string;
  color: string;
}

const bgOptions: BgOption[] = [
  { label: '흰색', color: '#FFFFFF' },
  { label: '파란색', color: '#DBEAFE' },
  { label: '회색', color: '#E5E7EB' },
];

export const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri, format } = route.params;
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bgIdx, setBgIdx] = useState(0);
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Read image file
      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64' as any,
      });
      
      // Convert base64 to blob
      const blob = await (await fetch(`data:image/jpeg;base64,${imageData}`)).blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', blob as any);
      formData.append('bg_color', bgOptions[bgIdx].color);
      formData.append('format', format.name);
      if (user?.id) {
        formData.append('user_id', user.id);
      }

      // Call Edge Function
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        'https://xasnznlnfswwmuwfxoar.supabase.co/functions/v1/remove-bg',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token || ''}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          // Out of credits
          Alert.alert(
            '크레딧 부족',
            errorData.error || '크레딧이 부족합니다. 프리미엄을 구매해주세요.',
            [
              { text: '취소', style: 'cancel' },
              { text: '구매하기', onPress: () => navigation.navigate('Payment') },
            ]
          );
          setLoading(false);
          return;
        }
        throw new Error(errorData.error || '처리 실패');
      }

      const result = await response.json();
      
      // Save processed image locally
      const base64Image = result.image_base64;
      // @ts-ignore - using legacy API
      const fileUri = `${FileSystem.documentDirectory}processed_${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(fileUri, base64Image, {
        encoding: 'base64' as any,
      });
      
      setProcessedImageUri(fileUri);
      setLoading(false);
    } catch (err: any) {
      console.error('Image processing error:', err);
      setError(err.message || '처리 중 오류 발생');
      setLoading(false);
      Alert.alert('오류', err.message || '이미지 처리에 실패했습니다.');
    }
  };

  const handleDownload = async () => {
    if (!processedImageUri) {
      Alert.alert('오류', '처리된 이미지가 없습니다.');
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(processedImageUri);
      await MediaLibrary.createAlbumAsync('SnapID', asset, false);
      Alert.alert('성공', '사진이 갤러리에 저장되었습니다!');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('오류', '다운로드에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    if (!processedImageUri) {
      Alert.alert('오류', '처리된 이미지가 없습니다.');
      return;
    }

    try {
      await Share.share({
        message: 'SnapID로 만든 증명사진',
        url: processedImageUri,
      });
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  const handleBgChange = async (index: number) => {
    if (bgIdx === index) return;
    setBgIdx(index);
    setProcessing(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Read original image file
      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64' as any,
      });
      
      const blob = await (await fetch(`data:image/jpeg;base64,${imageData}`)).blob();
      
      const formData = new FormData();
      formData.append('image', blob as any);
      formData.append('bg_color', bgOptions[index].color);
      formData.append('format', format.name);
      if (user?.id) {
        formData.append('user_id', user.id);
      }

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        'https://xasnznlnfswwmuwfxoar.supabase.co/functions/v1/remove-bg',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token || ''}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('배경 변경 실패');
      }

      const result = await response.json();
      // @ts-ignore - using legacy API
      const fileUri = `${FileSystem.documentDirectory}processed_${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(fileUri, result.image_base64, {
        encoding: 'base64' as any,
      });
      
      setProcessedImageUri(fileUri);
    } catch (err) {
      console.error('Background change error:', err);
      Alert.alert('오류', '배경 변경에 실패했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <IOSNavBar
        title="결과"
        leftLabel="뒤로"
        onBack={() => navigation.goBack()}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Format info */}
        <View style={styles.formatInfo}>
          <Text style={styles.formatText}>
            {format.name} {format.width && format.height && `· ${format.width}×${format.height}`}
          </Text>
        </View>

        {/* Photo preview */}
        <View style={styles.previewContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.textSecondary} />
              <Text style={styles.loadingText}>AI 처리 중...</Text>
            </View>
          ) : error ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={processImage} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View 
              style={[
                styles.photoWrapper,
                { backgroundColor: bgOptions[bgIdx].color }
              ]}
            >
              {processing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
              <Image 
                source={{ uri: processedImageUri || imageUri }} 
                style={styles.resultImage} 
              />
            </View>
          )}
        </View>

        {!loading && (
          <>
            {/* BG selector */}
            <View style={styles.bgSelectorContainer}>
              <View style={styles.bgSelector}>
                {bgOptions.map((bg, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.bgButton,
                      bgIdx === index && styles.bgButtonActive,
                    ]}
                    onPress={() => handleBgChange(index)}
                    activeOpacity={0.7}
                    disabled={processing}
                  >
                    <View 
                      style={[
                        styles.bgColorCircle,
                        { 
                          backgroundColor: bg.color,
                          borderColor: bgIdx === index ? 'rgba(255,255,255,0.3)' : '#E5E7EB',
                        }
                      ]} 
                    />
                    <Text 
                      style={[
                        styles.bgLabel,
                        bgIdx === index && styles.bgLabelActive,
                      ]}
                    >
                      {bg.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={handleDownload}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>다운로드</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Text style={styles.shareButtonText}>공유</Text>
              </TouchableOpacity>
            </View>

            {/* Premium */}
            <TouchableOpacity
              style={styles.premiumPrompt}
              onPress={() => navigation.navigate('Payment')}
              activeOpacity={0.6}
            >
              <Text style={styles.premiumText}>
                무료 버전에는 워터마크가 포함됩니다
              </Text>
              <Text style={styles.premiumLink}>
                프리미엄 구매하기
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },
  formatInfo: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  formatText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    minHeight: 340,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  photoWrapper: {
    width: 220,
    height: 286,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  resultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  bgSelectorContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  bgSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  bgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: Colors.white,
  },
  bgButtonActive: {
    backgroundColor: Colors.primary,
  },
  bgColorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  bgLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  bgLabelActive: {
    color: Colors.white,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: Colors.primary,
  },
  shareButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  shareButtonText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  premiumPrompt: {
    paddingTop: 16,
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  premiumLink: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
});
