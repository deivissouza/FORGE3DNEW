import React from 'react';
import { useAdmin } from '../src/context/AdminContext';
import { ChevronRight, Zap, ShieldCheck, Clock } from 'lucide-react';

export const HeroSection = () => {
    const { contentSections, isLoading } = useAdmin();

    // Default content if loading or not set
    const heroContent = contentSections['hero'] || {
        title: 'Impressão 3D Sob Demanda',
        subtitle: 'Preciso, rápido e profissional. Envie seu arquivo ou cole o link do modelo.',
        imageUrl: '', // Default background handled via CSS or empty
        buttonText: 'Quero Imprimir',
        buttonLink: '#order-section'
    };

    const handleScroll = () => {
        const element = document.getElementById('order-section');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isLoading) return null; // Or a skeleton

    return (
        <div className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-100/50 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-indigo-50/60 blur-2xl animate-bounce" style={{ animationDuration: '10s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-8 animate-fade-in border border-blue-100 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Novos materiais disponíveis: TPU Flex e ABS Pro
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight animate-slide-up">
                    {heroContent.title}
                </h1>

                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
                    {heroContent.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <button
                        onClick={handleScroll}
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                    >
                        {heroContent.buttonText}
                        <ChevronRight className="ml-2 -mr-1" size={20} />
                    </button>
                    <a
                        href="https://www.printables.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-base font-bold rounded-full text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-all hover:border-gray-300"
                    >
                        Explorar Modelos
                    </a>
                </div>

                {/* Features Strip */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto border-t border-gray-100 pt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Orçamento Instantâneo</h3>
                        <p className="text-sm text-gray-500 mt-2">Algoritmo inteligente que calcula preço baseado na geometria e volume da peça.</p>
                    </div>
                    <div className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Garantia de Qualidade</h3>
                        <p className="text-sm text-gray-500 mt-2">Revisão manual da malha e fatiamento otimizado para cada modelo.</p>
                    </div>
                    <div className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Envio em 48h</h3>
                        <p className="text-sm text-gray-500 mt-2">Produção expressa disponível para projetos urgentes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
