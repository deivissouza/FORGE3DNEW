import React, { createContext, useContext, useState, useEffect } from 'react';
import { MATERIALS as INITIAL_MATERIALS } from '../../constants';

export interface Material {
    id: string;
    name: string;
    pricePerGram: number;
    description: string;
}

interface PricingContextType {
    materials: Material[];
    updateMaterialPrice: (id: string, newPrice: number) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [materials, setMaterials] = useState<Material[]>(() => {
        const saved = localStorage.getItem('forge3d_materials');
        return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
    });

    useEffect(() => {
        localStorage.setItem('forge3d_materials', JSON.stringify(materials));
    }, [materials]);

    const updateMaterialPrice = (id: string, newPrice: number) => {
        setMaterials(prev => prev.map(mat =>
            mat.id === id ? { ...mat, pricePerGram: newPrice } : mat
        ));
    };

    return (
        <PricingContext.Provider value={{ materials, updateMaterialPrice }}>
            {children}
        </PricingContext.Provider>
    );
};

export const usePricing = () => {
    const context = useContext(PricingContext);
    if (!context) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
};
