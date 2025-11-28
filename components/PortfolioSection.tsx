import React from 'react';
import { useAdmin } from '../src/context/AdminContext';

export const PortfolioSection = () => {
    const { portfolioItems, isLoading } = useAdmin();

    if (isLoading || portfolioItems.length === 0) {
        return null;
    }

    const activeItems = portfolioItems.filter(item => item.isActive);

    if (activeItems.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50" id="portfolio">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Nossos Trabalhos
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Confira algumas das peças incríveis que já produzimos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeItems.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-blue-400 text-sm font-bold mb-1">{item.category}</span>
                                <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-300 text-sm">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
