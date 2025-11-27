import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SiteSettings {
    plaPricePerGram: number;
    petgPricePerGram: number;
    profitMargin: number;
    machineCostPerHour: number;
    minimumOrder: number;
    deliveryTime: string;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    whatsappMessageTemplate: string;
}

export interface Color {
    id: string;
    name: string;
    hex: string;
    material: 'PLA' | 'PETG';
    isActive: boolean;
}

export interface FeaturedItem {
    id: string;
    name: string;
    link: string;
    imageUrl: string;
    category: string;
    tag: string;
    description?: string;
    weightEstimate: number;
    isActive: boolean;
    displayOrder: number;
}

interface AdminContextType {
    settings: SiteSettings | null;
    colors: Color[];
    featuredItems: FeaturedItem[];
    isLoading: boolean;
    error: string | null;

    updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
    addColor: (color: Omit<Color, 'id'>) => Promise<void>;
    updateColor: (id: string, color: Partial<Color>) => Promise<void>;
    deleteColor: (id: string) => Promise<void>;
    addFeaturedItem: (item: Omit<FeaturedItem, 'id'>) => Promise<void>;
    updateFeaturedItem: (id: string, item: Partial<FeaturedItem>) => Promise<void>;
    deleteFeaturedItem: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [colors, setColors] = useState<Color[]>([]);
    const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        try {
            // Fetch settings
            const { data: settingsData, error: settingsError } = await supabase!
                .from('site_settings')
                .select('*')
                .eq('id', 'default')
                .single();

            if (settingsError) throw settingsError;

            if (settingsData) {
                setSettings({
                    plaPricePerGram: Number(settingsData.pla_price_per_gram),
                    petgPricePerGram: Number(settingsData.petg_price_per_gram),
                    profitMargin: Number(settingsData.profit_margin),
                    machineCostPerHour: Number(settingsData.machine_cost_per_hour),
                    minimumOrder: Number(settingsData.minimum_order),
                    deliveryTime: settingsData.delivery_time,
                    companyName: settingsData.company_name,
                    companyEmail: settingsData.company_email,
                    companyPhone: settingsData.company_phone,
                    companyAddress: settingsData.company_address,
                    whatsappMessageTemplate: settingsData.whatsapp_message_template,
                });
            }

            // Fetch colors
            const { data: colorsData, error: colorsError } = await supabase!
                .from('colors')
                .select('*')
                .order('material', { ascending: true });

            if (colorsError) throw colorsError;

            if (colorsData) {
                setColors(colorsData.map(c => ({
                    id: c.id,
                    name: c.name,
                    hex: c.hex,
                    material: c.material as 'PLA' | 'PETG',
                    isActive: c.is_active,
                })));
            }

            // Fetch featured items
            const { data: itemsData, error: itemsError } = await supabase!
                .from('featured_items')
                .select('*')
                .order('display_order', { ascending: true });

            if (itemsError) throw itemsError;

            if (itemsData) {
                setFeaturedItems(itemsData.map(i => ({
                    id: i.id,
                    name: i.name,
                    link: i.link,
                    imageUrl: i.image_url,
                    category: i.category,
                    tag: i.tag,
                    description: i.description,
                    weightEstimate: Number(i.weight_estimate),
                    isActive: i.is_active,
                    displayOrder: i.display_order,
                })));
            }

            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<SiteSettings>) => {
        if (!isSupabaseConfigured) return;

        try {
            const { error } = await supabase!
                .from('site_settings')
                .update({
                    pla_price_per_gram: newSettings.plaPricePerGram,
                    petg_price_per_gram: newSettings.petgPricePerGram,
                    profit_margin: newSettings.profitMargin,
                    machine_cost_per_hour: newSettings.machineCostPerHour,
                    minimum_order: newSettings.minimumOrder,
                    delivery_time: newSettings.deliveryTime,
                    company_name: newSettings.companyName,
                    company_email: newSettings.companyEmail,
                    company_phone: newSettings.companyPhone,
                    company_address: newSettings.companyAddress,
                    whatsapp_message_template: newSettings.whatsappMessageTemplate,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', 'default');

            if (error) throw error;

            setSettings(prev => ({ ...prev!, ...newSettings }));
        } catch (err) {
            console.error('Error updating settings:', err);
            throw err;
        }
    };

    const addColor = async (color: Omit<Color, 'id'>) => {
        if (!isSupabaseConfigured) return;

        const id = `${color.material.toLowerCase()}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;

        try {
            const { error } = await supabase!
                .from('colors')
                .insert({
                    id,
                    name: color.name,
                    hex: color.hex,
                    material: color.material,
                    is_active: color.isActive,
                });

            if (error) throw error;

            setColors(prev => [...prev, { ...color, id }]);
        } catch (err) {
            console.error('Error adding color:', err);
            throw err;
        }
    };

    const updateColor = async (id: string, color: Partial<Color>) => {
        if (!isSupabaseConfigured) return;

        try {
            const { error } = await supabase!
                .from('colors')
                .update({
                    name: color.name,
                    hex: color.hex,
                    is_active: color.isActive,
                })
                .eq('id', id);

            if (error) throw error;

            setColors(prev => prev.map(c => c.id === id ? { ...c, ...color } : c));
        } catch (err) {
            console.error('Error updating color:', err);
            throw err;
        }
    };

    const deleteColor = async (id: string) => {
        if (!isSupabaseConfigured) return;

        try {
            const { error } = await supabase!
                .from('colors')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setColors(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Error deleting color:', err);
            throw err;
        }
    };

    const addFeaturedItem = async (item: Omit<FeaturedItem, 'id'>) => {
        if (!isSupabaseConfigured) return;

        const id = `item-${Date.now()}`;

        try {
            const { error } = await supabase!
                .from('featured_items')
                .insert({
                    id,
                    name: item.name,
                    link: item.link,
                    image_url: item.imageUrl,
                    category: item.category,
                    tag: item.tag,
                    description: item.description,
                    weight_estimate: item.weightEstimate,
                    is_active: item.isActive,
                    display_order: item.displayOrder,
                });

            if (error) throw error;

            setFeaturedItems(prev => [...prev, { ...item, id }]);
        } catch (err) {
            console.error('Error adding featured item:', err);
            throw err;
        }
    };

    const updateFeaturedItem = async (id: string, item: Partial<FeaturedItem>) => {
        if (!isSupabaseConfigured) return;

        try {
            const { error } = await supabase!
                .from('featured_items')
                .update({
                    name: item.name,
                    link: item.link,
                    image_url: item.imageUrl,
                    category: item.category,
                    tag: item.tag,
                    description: item.description,
                    weight_estimate: item.weightEstimate,
                    is_active: item.isActive,
                    display_order: item.displayOrder,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;

            setFeaturedItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
        } catch (err) {
            console.error('Error updating featured item:', err);
            throw err;
        }
    };

    const deleteFeaturedItem = async (id: string) => {
        if (!isSupabaseConfigured) return;

        try {
            const { error } = await supabase!
                .from('featured_items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setFeaturedItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            console.error('Error deleting featured item:', err);
            throw err;
        }
    };

    return (
        <AdminContext.Provider value={{
            settings,
            colors,
            featuredItems,
            isLoading,
            error,
            updateSettings,
            addColor,
            updateColor,
            deleteColor,
            addFeaturedItem,
            updateFeaturedItem,
            deleteFeaturedItem,
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};
