import { PhotoFormat, BackgroundColor } from '../types';

export const photoFormats: PhotoFormat[] = [
  {
    id: 'passport',
    name: '여권 사진',
    width: 35,
    height: 45,
    unit: 'mm',
    description: '대한민국 여권 규격',
  },
  {
    id: 'resume',
    name: '이력서 사진',
    width: 3,
    height: 4,
    unit: 'cm',
    description: '일반 이력서 규격',
  },
  {
    id: 'visa',
    name: '비자 사진',
    width: 35,
    height: 45,
    unit: 'mm',
    description: '미국/유럽 비자 규격',
  },
  {
    id: 'custom',
    name: '커스텀',
    width: 40,
    height: 50,
    unit: 'mm',
    description: '사용자 지정 크기',
  },
];

export const backgroundColors: BackgroundColor[] = [
  { id: 'white', name: '흰색', color: '#FFFFFF' },
  { id: 'blue', name: '파란색', color: '#DBEAFE' },
  { id: 'gray', name: '회색', color: '#E2E8F0' },
];
