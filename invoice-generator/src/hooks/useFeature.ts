import { features } from '../config/features';

export const useFeature = (feature: keyof typeof features): boolean => {
  return features[feature];
};
