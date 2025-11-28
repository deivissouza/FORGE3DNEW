import React from 'react';
import { useAdmin } from '../src/context/AdminContext';
import { Layers, Palette } from 'lucide-react';

export const MaterialsSection = () => {
    const { colors, isLoading } = useAdmin();

    if (isLoading) return null;

    const plaColors = colors.filter(c => c.material === 'PLA' && c.isActive);
    const petgColors = colors.filter(c => c.material === 'PETG' && c.isActive);

    return (
        <section className="py-20 bg-white" id="materials">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Materiais & Cores
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Trabalhamos com os melhores filamentos do mercado para garantir resistência e acabamento premium.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* PLA Section */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                <Layers size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">PLA Premium</h3>
                                <p className="text-gray-500">Ideal para decoração e protótipos visuais</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            O PLA (Ácido Polilático) é um plástico biodegradável derivado de fontes renováveis.
                            Oferece excelente qualidade de superfície, detalhes precisos e é perfeito para peças
                            que não ficarão expostas a altas temperaturas.
                        </p>

                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Palette size={18} className="text-blue-600" />
                            Cores Disponíveis
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {plaColors.map(color => (
                                <div key={color.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                    <div
                                        className="w-6 h-6 rounded-full border border-gray-200 shadow-inner"
                                        style={{ backgroundColor: color.hex }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PETG Section */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                <Layers size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">PETG Engineering</h3>
                                <p className="text-gray-500">Para peças mecânicas e funcionais</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            O PETG combina a facilidade de impressão do PLA com a resistência do ABS.
                            É resistente a impactos, produtos químicos e suporta temperaturas moderadas.
                            Ideal para suportes, peças mecânicas e uso externo.
                        </p>

                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Palette size={18} className="text-indigo-600" />
                            Cores Disponíveis
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {petgColors.map(color => (
                                <div key={color.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                    <div
                                        className="w-6 h-6 rounded-full border border-gray-200 shadow-inner"
                                        style={{ backgroundColor: color.hex }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
