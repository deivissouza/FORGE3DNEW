import React, { useState } from 'react';
import { Menu, X, Box, ShoppingCart } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Forge3D</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors font-medium">Como Funciona</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors font-medium">Materiais</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors font-medium">Portfólio</a>
            <a href="#admin" className="text-gray-400 hover:text-gray-600 transition-colors font-medium text-sm">Admin</a>
            <button className="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
              <ShoppingCart size={18} />
              Meus Pedidos
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Como Funciona</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Materiais</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Portfólio</a>
          </div>
        </div>
      )}
    </nav>
  );
};
