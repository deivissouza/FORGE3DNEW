export type MaterialType = 'PLA' | 'PETG' | 'ABS' | 'TPU';

export interface PopularModel {
  id: string;
  name: string;
  creator: string;
  imageUrl: string;
  source: 'Printables' | 'Thingiverse' | 'MakerWorld' | 'Outros';
  tag: string;
  link: string;
  description?: string;
}

export interface PrintSettings {
  material: MaterialType;
  color: string;
  infill: number;
  layerHeight: number;
  scale: number;
}

export interface PricingBreakdown {
  volumeCost: number;
  timeCost: number;
  startupFee: number;
  total: number;
  weight: number; // in grams
  printTime: string;
}

export interface OrderFormState {
  file: File | null;
  link: string;
  settings: PrintSettings;
}
