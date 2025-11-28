import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SiteSettings {
    plaPricePerGram: number;
    petgPricePerGram: number;
    profitMargin: number;
    machineCostPerHour: number;
    minimumOrder: number;
    maxPrintSize: number;
    deliveryTime: string;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    whatsappMessageTemplate: string;
}

export interface MaterialColor {
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
    description: string;
    weightEstimate: number;
    isActive: boolean;
    displayOrder?: number;
}

export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    isActive: boolean;
}

export interface ContentSection {
    id: string;
    title: string;
    subtitle: string;
    content: any;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
}

interface AdminContextType {
    settings: SiteSettings | null;
    colors: MaterialColor[];
    featuredItems: FeaturedItem[];
    portfolioItems: PortfolioItem[];
    contentSections: Record<string, ContentSection>;
    isLoading: boolean;
    error: string | null;

    updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
    addColor: (color: Omit<MaterialColor, 'id'>) => Promise<void>;
    deleteColor: (id: string) => Promise<void>;
    addFeaturedItem: (item: Omit<FeaturedItem, 'id'>) => Promise<void>;
    updateFeaturedItem: (id: string, item: Partial<FeaturedItem>) => Promise<void>;
    deleteFeaturedItem: (id: string) => Promise<void>;

    // CMS Functions
    addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => Promise<void>;
    deletePortfolioItem: (id: string) => Promise<void>;
    updateContentSection: (id: string, data: Partial<ContentSection>) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [colors, setColors] = useState<MaterialColor[]>([]);
    const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [contentSections, setContentSections] = useState<Record<string, ContentSection>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = async () => {
        if (!isSupabaseConfigured) {
            // Fallback to local storage or defaults
            const stored = localStorage.getItem('admin_settings');
            if (stored) {
                setSettings(JSON.parse(stored));
            } else {
                setSettings({
                    plaPricePerGram: 0.15,
                    petgPricePerGram: 0.20,
                    profitMargin: 30,
                    machineCostPerHour: 5,
                    minimumOrder: 15,
                    maxPrintSize: 250,
                    deliveryTime: 'Entrega a combinar',
                    companyName: 'Forge3D',
                    companyEmail: 'contato@forge3d.com',
                    companyPhone: '5511985455659',
                    companyAddress: 'São Paulo, SP',
                    whatsappMessageTemplate: 'Olá! Gostaria de um orçamento para impressão 3D.'
                });
            }
            return;
        }

        try {
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
                    maxPrintSize: Number(settingsData.max_print_size || 250),
                    deliveryTime: settingsData.delivery_time,
                    companyName: settingsData.company_name,
                    companyEmail: settingsData.company_email,
                    companyPhone: settingsData.company_phone,
                    companyAddress: settingsData.company_address,
                    whatsappMessageTemplate: settingsData.whatsapp_message_template,
                });
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        await fetchSettings();

        if (isSupabaseConfigured) {
            try {
                // Fetch colors
                const { data: colorsData } = await supabase!
                    .from('colors')
                    .select('*')
                    .order('material', { ascending: true });

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
                const { data: itemsData } = await supabase!
                    .from('featured_items')
                    .select('*')
                    .order('created_at', { ascending: false });

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
                        displayOrder: i.display_order
                    })));
                }

                // Fetch Portfolio Items
                const { data: portfolioData } = await supabase!.from('portfolio_items').select('*').order('created_at', { ascending: false });
                if (portfolioData) {
                    setPortfolioItems(portfolioData.map(i => ({
                        id: i.id,
                        title: i.title,
                        description: i.description,
                        imageUrl: i.image_url,
                        category: i.category,
                        isActive: i.is_active
                    })));
                }

                // Fetch Content Sections
                const { data: contentData } = await supabase!.from('content_sections').select('*');
                if (contentData) {
                    const sections: Record<string, ContentSection> = {};
                    contentData.forEach(c => {
                        sections[c.id] = {
                            id: c.id,
                            title: c.title,
                            subtitle: c.subtitle,
                            content: c.content,
                            imageUrl: c.image_url,
                            buttonText: c.button_text,
                            buttonLink: c.button_link
                        };
                    });
                    setContentSections(sections);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                    max_print_size: newSettings.maxPrintSize,
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

    const addColor = async (color: Omit<MaterialColor, 'id'>) => {
        if (!isSupabaseConfigured) return;

        try {
            const { data, error } = await supabase!
                .from('colors')
                .insert({
                    name: color.name,
                    hex: color.hex,
                    material: color.material,
                    is_active: color.isActive,
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setColors(prev => [...prev, { ...color, id: data.id }]);
            }
        } catch (err) {
            console.error('Error adding color:', err);
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

        try {
            const { data, error } = await supabase!
                .from('featured_items')
                .insert({
                    name: item.name,
                    link: item.link,
                    image_url: item.imageUrl,
                    category: item.category,
                    tag: item.tag,
                    description: item.description,
                    weight_estimate: item.weightEstimate,
                    is_active: item.isActive,
                    display_order: item.displayOrder,
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setFeaturedItems(prev => [...prev, { ...item, id: data.id }]);
            }
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

    // CMS Functions
    const addPortfolioItem = async (item: Omit<PortfolioItem, 'id'>) => {
        if (!isSupabaseConfigured) return;
        const { data, error } = await supabase!.from('portfolio_items').insert([{
            title: item.title,
            description: item.description,
            image_url: item.imageUrl,
            category: item.category,
            is_active: item.isActive
        }]).select().single();

        if (error) throw error;
        if (data) {
            setPortfolioItems(prev => [...prev, { ...item, id: data.id }]);
        }
    };

    const deletePortfolioItem = async (id: string) => {
        if (!isSupabaseConfigured) return;
        const { error } = await supabase!.from('portfolio_items').delete().eq('id', id);
        if (error) throw error;
        setPortfolioItems(prev => prev.filter(i => i.id !== id));
    };

    const updateContentSection = async (id: string, data: Partial<ContentSection>) => {
        if (!isSupabaseConfigured) return;

        // Check if exists first
        const { data: existing } = await supabase!.from('content_sections').select('id').eq('id', id).single();

        let error;
        if (existing) {
            const { error: updateError } = await supabase!.from('content_sections').update({
                title: data.title,
                subtitle: data.subtitle,
                content: data.content,
                image_url: data.imageUrl,
                button_text: data.buttonText,
                button_link: data.buttonLink,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase!.from('content_sections').insert([{
                id: id,
                title: data.title,
                subtitle: data.subtitle,
                content: data.content,
                image_url: data.imageUrl,
                button_text: data.buttonText,
                button_link: data.buttonLink
            }]);
            error = insertError;
        }

        if (error) throw error;

        setContentSections(prev => ({
            ...prev,
            [id]: { ...prev[id], ...data, id }
        }));
    };

    return (
        <AdminContext.Provider value={{
            settings,
            colors,
            featuredItems,
            portfolioItems,
            contentSections,
            isLoading,
            error,
            updateSettings,
            addColor,
            deleteColor,
            addFeaturedItem,
            updateFeaturedItem,
            deleteFeaturedItem,
            addPortfolioItem,
            deletePortfolioItem,
            updateContentSection
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
