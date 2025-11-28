import React from 'react';
import { Upload, Zap, Truck, CheckCircle } from 'lucide-react';
import { useAdmin } from '../src/context/AdminContext';

const iconMap: Record<string, any> = {
    'Upload': Upload,
    'Zap': Zap,
    'Truck': Truck,
    'CheckCircle': CheckCircle
};

export const HowItWorksSection = () => {
    const { contentSections, isLoading } = useAdmin();

    // Fallback data if not in admin context or data not loaded
    const defaultSteps = [
        {
            icon: 'Upload',
            title: 'Envie seu Arquivo',
            description: 'Faça upload do seu modelo 3D (STL, OBJ) ou nos envie o link do projeto.'
        },
        {
            icon: 'Zap',
            title: 'Orçamento Instantâneo',
            description: 'Nossa IA analisa o arquivo e calcula o preço na hora, sem espera.'
        },
        {
            icon: 'CheckCircle',
            title: 'Aprovação',
            description: 'Escolha o material, cor e confirme o pedido com pagamento seguro.'
        },
        {
            icon: 'Truck',
            title: 'Produção e Envio',
            description: 'Imprimimos sua peça com alta qualidade e enviamos para todo o Brasil.'
        }
    ];

    const howItWorksData = contentSections['how_it_works'];
    const steps = howItWorksData?.content || defaultSteps;
    const title = howItWorksData?.title || 'Como Funciona';
    const subtitle = howItWorksData?.subtitle || 'Do arquivo digital à peça física em poucos passos simples.';

    return (
        <section className="py-20 bg-white" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step: any, index: number) => {
                        const IconComponent = iconMap[step.icon] || Upload;
                        return (
                            <div key={index} className="relative p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <IconComponent size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
