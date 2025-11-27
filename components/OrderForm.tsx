import React, { useState, useEffect, useRef } from 'react';
import { Upload, Link as LinkIcon, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { ThreePreview } from './ThreePreview';
import { COLORS, BASE_STARTUP_FEE } from '../constants';
import { PricingBreakdown, PrintSettings } from '../types';
import { CheckoutModal } from './CheckoutModal';
import { useStore } from '../src/context/StoreContext';

interface OrderFormProps {
  initialLink?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialLink }) => {
  const { materials } = useStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [settings, setSettings] = useState<PrintSettings>({
    material: 'PLA',
    color: COLORS[0].hex,
    infill: 20,
    layerHeight: 0.2,
    scale: 100,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLink) {
      setActiveTab('link');
      setLink(initialLink);
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      simulateCalculation();
    }
  }, [initialLink]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      if (fileUrl) URL.revokeObjectURL(fileUrl);
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);

      simulateCalculation();
    }
  };

  const parseLinkMetadata = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);

      if (url.includes('printables.com') && pathSegments.length >= 2) {
        const slug = pathSegments[pathSegments.length - 1];
        const namePart = slug.replace(/^\d+-/, '').replace(/-/g, ' ');
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
      return 'Modelo Externo';
    } catch (e) {
      return 'Modelo Externo';
    }
  };

  const simulateCalculation = () => {
    setIsCalculating(true);
    setPricing(null);

    setTimeout(() => {
      const selectedMaterial = materials.find(m => m.id === settings.material);
      const pricePerGram = selectedMaterial?.pricePerGram || 0.15;

      const baseWeight = file ? (file.size / 1024 / 10) : 50;
      const estimatedWeight = Math.floor(baseWeight * (settings.scale / 100) * (settings.infill / 20));

      const materialCost = estimatedWeight * pricePerGram;
      const timeCost = (estimatedWeight * 0.5);

      setPricing({
        volumeCost: materialCost,
        timeCost: timeCost,
        startupFee: BASE_STARTUP_FEE,
        total: materialCost + timeCost + BASE_STARTUP_FEE,
        weight: estimatedWeight,
        printTime: `${Math.floor(estimatedWeight / 10)}h ${Math.floor(Math.random() * 60)} m`
      });
      setIsCalculating(false);
    }, 1500);
  };

  useEffect(() => {
    if (file || link) {
      simulateCalculation();
    }
  }, [settings, materials]); // Re-calculate if material prices change

  return (
    <div id="order-section" ref={scrollRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Left Column: Visuals */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <ThreePreview color={settings.color} fileUrl={activeTab === 'upload' ? fileUrl : null} />

          {pricing && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Orçamento Estimado</h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Instantâneo</span>
              </div>

              <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100">
                <span className="text-sm text-gray-500 mb-1">Valor Total</span>
                <span className="text-5xl font-extrabold text-primary tracking-tight">
                  R$ {pricing.total.toFixed(2)}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide">Peso</span>
                  <span className="font-bold text-gray-900">{pricing.weight.toFixed(0)}g</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide">Tempo</span>
                  <span className="font-bold text-gray-900">{pricing.printTime}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full mt-6 bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-700 hover:shadow-green-600/40 transition-all transform active:scale-[0.98] text-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={24} />
                Quero Imprimir
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex - 1 py - 4 text - sm font - bold flex items - center justify - center gap - 2 transition - colors ${activeTab === 'upload' ? 'bg-white text-primary border-b-2 border-primary' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'} `}
            >
              <Upload size={18} />
              Upload Arquivo
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex - 1 py - 4 text - sm font - bold flex items - center justify - center gap - 2 transition - colors ${activeTab === 'link' ? 'bg-white text-primary border-b-2 border-primary' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'} `}
            >
              <LinkIcon size={18} />
              Link Externo
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Input Section */}
            <div>
              {activeTab === 'upload' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary hover:bg-blue-50/50 transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".stl,.obj,.3mf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900">Arraste seu arquivo ou clique aqui</h4>
                  <p className="text-sm text-gray-500 mt-2">Suporta STL, OBJ, 3MF (Max 50MB)</p>
                  {file && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle2 size={14} />
                      {file.name}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Link do Modelo (Printables / Thingiverse)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="url"
                      placeholder="https://www.printables.com/model/..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      onBlur={simulateCalculation}
                    />
                  </div>
                  {link && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${link.length}/200`} alt="Preview" className="w-full h-full object-cover" />
                      </div >
                      <div>
                        <h4 className="font-bold text-gray-900">{parseLinkMetadata(link)}</h4>
                        <p className="text-xs text-gray-500 mt-1">Detectado via Link</p>
                      </div>
                    </div >
                  )}
                </div >
              )}
            </div >

            {/* Material & Color */}
            < div className="space-y-4" >
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                1. Material e Cor
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSettings({ ...settings, material: mat.id as any })}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${settings.material === mat.id ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="font-bold text-sm text-gray-900">{mat.name}</div>
                    <div className="text-xs text-gray-500 mt-1">R${mat.pricePerGram}/g</div>
                    {settings.material === mat.id && <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-bl-lg"></div>}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap pt-2">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSettings({ ...settings, color: color.hex })}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${settings.color === color.hex ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {settings.color === color.hex && (
                      <CheckCircle2 size={16} className={color.name === 'Branco' ? 'text-gray-900' : 'text-white'} />
                    )}
                  </button>
                ))}
              </div>
            </div >

            {/* Print Settings */}
            < div className="space-y-6" >
              <h3 className="text-lg font-bold text-gray-900">2. Configurações de Impressão</h3>

              <div className="grid grid-cols-1 gap-6">


                <div className="space-y-2">
                  <label className="flex justify-between text-sm font-medium text-gray-700">
                    Escala
                    <span className="text-primary font-bold">{settings.scale}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="1"
                    value={settings.scale}
                    onChange={(e) => setSettings({ ...settings, scale: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div >

            {isCalculating && (
              <div className="flex items-center justify-center gap-2 text-primary py-4 bg-blue-50 rounded-lg animate-pulse">
                <Loader2 className="animate-spin" />
                <span className="font-medium">Calculando geometria e custos...</span>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3 text-yellow-800 text-sm">
              <AlertCircle className="shrink-0" size={20} />
              <p>O preço final pode sofrer pequenos ajustes após análise técnica manual da malha do arquivo.</p>
            </div>

          </div >
        </div >
      </div >

      {pricing && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          pricing={pricing}
          settings={settings}
        />
      )}
    </div >
  );
};
