import React from 'react';
import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Forge3D
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Transformando ideias digitais em realidade física.
                            Impressão 3D de alta qualidade para protótipos, peças de reposição e arte.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Links Úteis</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#order-section" className="hover:text-primary transition-colors">Solicitar Orçamento</a></li>
                            <li><a href="#popular-models" className="hover:text-primary transition-colors">Modelos Populares</a></li>
                            <li><a href="https://www.thingiverse.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Thingiverse (Modelos Grátis)</a></li>
                            <li><a href="https://www.printables.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Printables (Modelos Grátis)</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Contato</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-center gap-2">
                                <MessageCircle size={16} className="text-green-500" />
                                <span>(11) 98545-5659</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-blue-500" />
                                <span>contato@forge3d.com.br</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-red-500" />
                                <span>São Paulo, SP - Enviamos para todo Brasil</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Forge3D. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};
