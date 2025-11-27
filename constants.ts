import { PopularModel } from './types';

export const MATERIALS = [
  { id: 'PLA', name: 'PLA Standard', pricePerGram: 0.15, description: 'Econômico, fácil de imprimir, biodegradável. Ideal para decoração e protótipos.' },
  { id: 'PETG', name: 'PETG Pro', pricePerGram: 0.20, description: 'Resistente a impacto e temperatura. Ótimo para peças mecânicas.' },
  { id: 'ABS', name: 'ABS Industrial', pricePerGram: 0.22, description: 'Alta resistência térmica e durabilidade. Requer pós-processamento.' },
  { id: 'TPU', name: 'TPU Flex', pricePerGram: 0.30, description: 'Material flexível e elástico.' },
];

export const COLORS = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Preto', hex: '#000000' },
  { name: 'Cinza Espacial', hex: '#4B5563' },
  { name: 'Azul Real', hex: '#2563EB' },
  { name: 'Vermelho Fogo', hex: '#DC2626' },
  { name: 'Roxo Galaxy', hex: '#7C3AED' },
  { name: 'Laranja Safety', hex: '#F97316' },
];

export const POPULAR_MODELS: PopularModel[] = [
  {
    id: 'dummy13',
    name: 'Dummy 13 Articulado',
    creator: 'soozafone',
    source: 'Printables',
    imageUrl: 'https://media.printables.com/media/prints/593185/images/4745868_8a4b8f8f-8f8f-4b8f-8f8f-8f8f8f8f8f8f/thumbs/cover/1280x960/jpg/dummy13-cover.jpg',
    tag: 'Muito pedido pelos clientes',
    link: 'https://www.printables.com/model/593185-dummy-13-printable-jointed-figure-beta-files',
  },
  {
    id: 'gear-bearing',
    name: 'Engrenagem Mecânica',
    creator: 'emmett',
    source: 'Thingiverse',
    imageUrl: 'https://cdn.thingiverse.com/renders/b5/02/52/56/66/53451_preview_featured.jpg',
    tag: 'Ideal para testes mecânicos',
    link: 'https://www.thingiverse.com/thing:53451',
  },
  {
    id: 'vase-mode',
    name: 'Vaso Paramétrico',
    creator: 'glitchpudding',
    source: 'MakerWorld',
    imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800',
    tag: 'Decoração premium em PLA/PETG',
    link: 'https://makerworld.com/en/models/12345',
  },
];

export const BASE_STARTUP_FEE = 15.00; // R$
