import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OrderForm } from './components/OrderForm';
import { Footer } from './components/Footer';
import { StoreProvider } from './src/context/StoreContext';
import { AdminProvider } from './src/context/AdminContext';
import { AdminPanelMVP } from './components/admin/AdminPanelMVP';
import { FeaturedSectionMVP } from './components/FeaturedSectionMVP';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { MaterialsSection } from './components/MaterialsSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ExternalLink } from 'lucide-react';
import { PopularModel } from './types';

export default function App() {
  const [selectedPopularLink, setSelectedPopularLink] = useState<string | undefined>(undefined);
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPath === '#admin') {
    try {
      return (
        <AdminProvider>
          <div className="min-h-screen bg-gray-50">
            <AdminPanelMVP />
          </div>
        </AdminProvider>
      );
    } catch (error) {
      console.error('Admin render error:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar Admin Panel</h1>
            <p className="text-gray-600 mb-4">Por favor, recarregue a página.</p>
            <pre className="text-xs text-left bg-gray-100 p-4 rounded overflow-auto max-w-2xl">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        </div>
      );
    }
  }

  return (
    <AdminProvider>
      <StoreProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <HeroSection />

            <HowItWorksSection />

            <MaterialsSection />

            <PortfolioSection />

            {/* Inspiration Section */}
            <div className="bg-gray-50 py-16 border-y border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Onde encontrar modelos?</h2>
                <p className="text-gray-500 mb-10 max-w-2xl mx-auto">Não tem um arquivo? Explore milhões de modelos gratuitos nestes sites e cole o link no nosso formulário.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a href="https://www.thingiverse.com" target="_blank" rel="noopener noreferrer" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <ExternalLink size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Thingiverse</h3>
                    <p className="text-sm text-gray-500 mt-2">O maior repositório de modelos 3D gratuitos do mundo.</p>
                  </a>

                  <a href="https://www.printables.com" target="_blank" rel="noopener noreferrer" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                      <ExternalLink size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Printables</h3>
                    <p className="text-sm text-gray-500 mt-2">Modelos de alta qualidade verificados pela comunidade Prusa.</p>
                  </a>

                  <a href="https://cults3d.com" target="_blank" rel="noopener noreferrer" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                      <ExternalLink size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Cults3D</h3>
                    <p className="text-sm text-gray-500 mt-2">Designers independentes e modelos artísticos exclusivos.</p>
                  </a>
                </div>
              </div>
            </div>

            <FeaturedSectionMVP onSelectItem={(link) => {
              const element = document.getElementById('order-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }} />

            <OrderForm initialLink={selectedPopularLink} />
          </main>

          <Footer />
        </div>
      </StoreProvider>
    </AdminProvider>
  );
}
