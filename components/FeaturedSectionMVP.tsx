import React from 'react';
import { useAdmin } from '../src/context/AdminContext';
import { ExternalLink, Printer } from 'lucide-react';
import { calculateQuote } from '../src/lib/calculator';

interface FeaturedSectionMVPProps {
    onSelectItem: (link: string, name: string, weight: number) => void;
}

export const FeaturedSectionMVP: React.FC<FeaturedSectionMVPProps> = ({ onSelectItem }) => {
    const { featuredItems, settings, isLoading } = useAdmin();

    if (isLoading || !settings) {
        return null;
    }

    const activeItems = featuredItems.filter(item => item.isActive).slice(0, 6);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        ✨ Itens Incríveis
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Modelos testados e prontos para impressão. Clique e receba seu orçamento instantâneo!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeItems.map((item) => {
                        // Calculate price for this item
                        const quote = calculateQuote(item.weightEstimate, 'PLA', {
                            plaPricePerGram: settings.plaPricePerGram,
                            petgPricePerGram: settings.petgPricePerGram,
                            profitMargin: settings.profitMargin,
                            machineCostPerHour: settings.machineCostPerHour,
                            minimumOrder: settings.minimumOrder,
                        });

                        return (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-500">A partir de</p>
                                            <p className="text-2xl font-extrabold text-blue-600">
                                                R$ {quote.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Peso estimado</p>
                                            <p className="text-sm font-bold text-gray-900">{item.weightEstimate}g</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onSelectItem(item.link, item.name, item.weightEstimate)}
                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Printer size={18} />
                                            Quero Imprimir
                                        </button>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
