export interface PhotoFormat {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: 'mm' | 'cm';
  description?: string;
}

export interface BackgroundColor {
  id: string;
  name: string;
  color: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Camera: undefined;
  FormatSelect: { imageUri: string };
  Result: { imageUri: string; format: PhotoFormat };
  Payment: undefined;
};
