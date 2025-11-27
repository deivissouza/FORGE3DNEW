import React, { useState } from 'react';
import { X, CheckCircle2, Truck, CreditCard } from 'lucide-react';
import { PricingBreakdown, PrintSettings } from '../types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    pricing: PricingBreakdown;
    settings: PrintSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, pricing, settings }) => {
    const [step, setStep] = useState<'details' | 'success'>('details');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('success');
        }, 2000);
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl transform transition-all scale-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Recebido!</h2>
                    <p className="text-gray-500 mb-8">
                        Seu pedido #{Math.floor(Math.random() * 10000)} foi confirmado.
                        Enviamos os detalhes para seu e-mail.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
                    >
                        Voltar para o Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">

                {/* Order Summary Sidebar */}
                <div className="bg-gray-50 p-8 md:w-1/3 border-r border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Resumo do Pedido</h3>

                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="text-gray-500 block">Material</span>
                            <span className="font-medium text-gray-900">{settings.material} - {settings.color}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Configurações</span>
                            <span className="font-medium text-gray-900">Infill {settings.infill}% | Escala {settings.scale}%</span>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">R$ {(pricing.total - pricing.startupFee).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Taxa Setup</span>
                                <span className="font-medium">R$ {pricing.startupFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-primary mt-4">
                                <span>Total</span>
                                <span>R$ {pricing.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="p-8 md:w-2/3 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nome Completo</label>
                                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Telefone</label>
                                <input required type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">E-mail</label>
                            <input required type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Endereço de Entrega</label>
                            <textarea required rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"></textarea>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>Processando...</>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Pagar R$ {pricing.total.toFixed(2)}
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                                <Truck size={12} />
                                Frete calculado no próximo passo
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
