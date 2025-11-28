import React from 'react';
import { Upload, Zap, Truck, CheckCircle } from 'lucide-react';

export const HowItWorksSection = () => {
    const steps = [
        {
            icon: Upload,
            title: '1. Envie seu Arquivo',
            description: 'Faça upload do seu modelo 3D (STL, OBJ) ou nos envie o link do projeto.'
        },
        {
            icon: Zap,
            title: '2. Orçamento Instantâneo',
            description: 'Nossa IA analisa o arquivo e calcula o preço na hora, sem espera.'
        },
        {
            icon: CheckCircle,
            title: '3. Aprovação',
            description: 'Escolha o material, cor e confirme o pedido com pagamento seguro.'
        },
        {
            icon: Truck,
            title: '4. Produção e Envio',
            description: 'Imprimimos sua peça com alta qualidade e enviamos para todo o Brasil.'
        }
    ];

    return (
        <section className="py-20 bg-white" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Como Funciona
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Do arquivo digital à peça física em poucos passos simples.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <step.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
