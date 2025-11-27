import React from 'react';
import { Download, ExternalLink, Printer } from 'lucide-react';
import { useStore } from '../src/context/StoreContext';
import { PopularModel } from '../types';

interface PopularSectionProps {
  onSelectModel: (model: PopularModel) => void;
}

export const PopularSection: React.FC<PopularSectionProps> = ({ onSelectModel }) => {
  const { popularModels, contactInfo } = useStore();
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* External Repositories Banner */}
        <div className="mb-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Milhares de Modelos Gratuitos</h2>
            <p className="text-gray-600">
              Não achou o que queria? Navegue pelos maiores repositórios de impressão 3D do mundo e cole o link acima.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.printables.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#fa6831] text-white font-bold rounded-xl hover:bg-[#e35622] transition-colors shadow-lg shadow-orange-500/20"
            >
              <ExternalLink size={18} />
              Printables
            </a>
            <a
              href="https://www.thingiverse.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#248bfb] text-white font-bold rounded-xl hover:bg-[#1b73d3] transition-colors shadow-lg shadow-blue-500/20"
            >
              <ExternalLink size={18} />
              Thingiverse
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Não encontrou o modelo que deseja?</h2>
            <p className="text-gray-600">
              Fale diretamente comigo para um orçamento personalizado ou ajuda para encontrar seu modelo.
            </p>
          </div>
          <a
            href={`https://wa.me/${contactInfo.phone}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/20 whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Falar com {contactInfo.name}
          </a>
        </div>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Destaques da Comunidade</h2>
            <p className="text-gray-500 mt-2">Modelos testados e aprovados para impressão imediata.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularModels.map((model) => (
            <div
              key={model.id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-full">
                    {model.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    onClick={() => onSelectModel(model)}
                    className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Printer size={18} />
                    Imprimir Este Modelo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
