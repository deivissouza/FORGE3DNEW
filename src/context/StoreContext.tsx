import React, { createContext, useContext, useState, useEffect } from 'react';
import { MATERIALS as INITIAL_MATERIALS, POPULAR_MODELS as INITIAL_MODELS } from '../../constants';
import { PopularModel } from '../../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Material {
    id: string;
    name: string;
    pricePerGram: number;
    description: string;
}

export interface ContactInfo {
    name: string;
    phone: string;
}

interface StoreContextType {
    materials: Material[];
    popularModels: PopularModel[];
    contactInfo: ContactInfo;
    isLoading: boolean;
    error: string | null;
    updateMaterialPrice: (id: string, newPrice: number) => Promise<void>;
    addMaterial: (material: Material) => Promise<void>;
    deleteMaterial: (id: string) => Promise<void>;
    addModel: (model: PopularModel) => Promise<void>;
    updateModel: (model: PopularModel) => Promise<void>;
    deleteModel: (id: string) => Promise<void>;
    updateContactInfo: (info: ContactInfo) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
    const [popularModels, setPopularModels] = useState<PopularModel[]>(INITIAL_MODELS);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ name: 'Deivis', phone: '5511985455659' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            if (!isSupabaseConfigured) {
                // Fallback to localStorage
                const savedMaterials = localStorage.getItem('forge3d_materials');
                const savedModels = localStorage.getItem('forge3d_models');
                const savedContact = localStorage.getItem('forge3d_contact');

                if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
                if (savedModels) setPopularModels(JSON.parse(savedModels));
                if (savedContact) setContactInfo(JSON.parse(savedContact));

                setIsLoading(false);
                return;
            }

            try {
                // Fetch materials
                const { data: materialsData, error: materialsError } = await supabase!
                    .from('materials')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (materialsError) throw materialsError;

                // Fetch popular models
                const { data: modelsData, error: modelsError } = await supabase!
                    .from('popular_models')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (modelsError) throw modelsError;

                // Fetch contact info
                const { data: contactData, error: contactError } = await supabase!
                    .from('site_config')
                    .select('value')
                    .eq('key', 'contact_info')
                    .single();

                if (contactError && contactError.code !== 'PGRST116') throw contactError;

                // Update state
                if (materialsData && materialsData.length > 0) {
                    setMaterials(materialsData.map(m => ({
                        id: m.id,
                        name: m.name,
                        description: m.description,
                        pricePerGram: Number(m.price_per_gram)
                    })));
                }

                if (modelsData && modelsData.length > 0) {
                    setPopularModels(modelsData.map(m => ({
                        id: m.id,
                        name: m.name,
                        creator: m.creator,
                        imageUrl: m.image_url,
                        source: m.source as PopularModel['source'],
                        tag: m.tag,
                        link: m.link,
                        description: m.description || undefined
                    })));
                }

                if (contactData) {
                    setContactInfo(contactData.value as ContactInfo);
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data from Supabase:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Actions
    const updateMaterialPrice = async (id: string, newPrice: number) => {
        const updatedMaterials = materials.map(mat =>
            mat.id === id ? { ...mat, pricePerGram: newPrice } : mat
        );
        setMaterials(updatedMaterials);

        if (!isSupabaseConfigured) {
            localStorage.setItem('forge3d_materials', JSON.stringify(updatedMaterials));
            return;
        }

        try {
            const { error } = await supabase!
                .from('materials')
                .update({ price_per_gram: newPrice })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating material price:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const addModel = async (model: PopularModel) => {
        const updatedModels = [...popularModels, model];
        setPopularModels(updatedModels);

        if (!isSupabaseConfigured) {
            localStorage.setItem('forge3d_models', JSON.stringify(updatedModels));
            return;
        }

        try {
            const { error } = await supabase!
                .from('popular_models')
                .insert({
                    id: model.id,
                    name: model.name,
                    creator: model.creator,
                    image_url: model.imageUrl,
                    source: model.source,
                    tag: model.tag,
                    link: model.link,
                    description: model.description || null
                });

            if (error) throw error;
        } catch (err) {
            console.error('Error adding model:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const updateModel = async (updatedModel: PopularModel) => {
        const updatedModels = popularModels.map(m =>
            m.id === updatedModel.id ? updatedModel : m
        );
        setPopularModels(updatedModels);

        if (!isSupabaseConfigured) {
            localStorage.setItem('forge3d_models', JSON.stringify(updatedModels));
            return;
        }

        try {
            const { error } = await supabase!
                .from('popular_models')
                .update({
                    name: updatedModel.name,
                    creator: updatedModel.creator,
                    image_url: updatedModel.imageUrl,
                    source: updatedModel.source,
                    tag: updatedModel.tag,
                    link: updatedModel.link,
                    description: updatedModel.description || null
                })
                .eq('id', updatedModel.id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating model:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const deleteModel = async (id: string) => {
        const updatedModels = popularModels.filter(m => m.id !== id);
        setPopularModels(updatedModels);

        if (!isSupabaseConfigured) {
            localStorage.setItem('forge3d_models', JSON.stringify(updatedModels));
            return;
        }

        try {
            const { error } = await supabase!
                .from('popular_models')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting model:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const addMaterial = async (material: Material) => {
        const updatedMaterials = [...materials, material];
        setMaterials(updatedMaterials);

        if (!isSupabaseConfigured) {
            localStorage.setItem('forge3d_materials', JSON.stringify(updatedMaterials));
            return;
        }

        try {
            const { error } = await supabase!
                .from('materials')
                .insert({
                    id: material.id,
                    name: material.name,
                    price_per_gram: material.pricePerGram,
                    description: material.description
                });

            if (error) throw error;
        } catch (err) {
            console.error('Error adding material:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const deleteMaterial = async (id: string) => {
        const updatedMaterials = materials.filter(m => m.id !== id);
        setMaterials(updatedMaterials);

        if (!isSupabaseConfigured) {
            localStorage.setItem('forge3d_materials', JSON.stringify(updatedMaterials));
            return;
        }

        try {
            const { error } = await supabase!
                .from('materials')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting material:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const updateContactInfo = async (info: ContactInfo) => {
        setContactInfo(info);

        if (!isSupabaseConfigured) {
            localStorage.setItem('forge3d_contact', JSON.stringify(info));
            return;
        }

        try {
            const { error } = await supabase!
                .from('site_config')
                .upsert({
                    key: 'contact_info',
                    value: info,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
        } catch (err) {
            console.error('Error updating contact info:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    return (
        <StoreContext.Provider value={{
            materials,
            popularModels,
            contactInfo,
            isLoading,
            error,
            updateMaterialPrice,
            addModel,
            updateModel,
            deleteModel,
            addMaterial,
            deleteMaterial,
            updateContactInfo
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
