import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../src/context/AdminContext';
import { Settings, Palette, Star, LogOut, Loader2, Save, Layout, Image as ImageIcon, Trash2, Plus } from 'lucide-react';

export const AdminPanelMVP = () => {
    const {
        settings, colors, featuredItems, portfolioItems, contentSections, isLoading,
        updateSettings, addColor, deleteColor,
        addFeaturedItem, deleteFeaturedItem,
        addPortfolioItem, deletePortfolioItem, updateContentSection
    } = useAdmin();

    const [activeTab, setActiveTab] = useState<'pricing' | 'colors' | 'featured' | 'content' | 'portfolio'>('pricing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Pricing form state
    const [pricingForm, setPricingForm] = useState({
        plaPricePerGram: 0.15,
        petgPricePerGram: 0.20,
        profitMargin: 30,
        machineCostPerHour: 5,
        minimumOrder: 15,
        maxPrintSize: 250,
    });

    // Color form state
    const [colorForm, setColorForm] = useState({
        name: '',
        hex: '#3B82F6',
        material: 'PLA' as 'PLA' | 'PETG',
        isActive: true,
    });

    // Featured item form state
    const [itemForm, setItemForm] = useState({
        name: '',
        link: '',
        imageUrl: '',
        category: 'Geral',
        tag: 'Novo',
        description: '',
        weightEstimate: 50,
        isActive: true,
        displayOrder: 0,
    });

    // Portfolio form state
    const [portfolioForm, setPortfolioForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
        category: 'Geral',
        isActive: true,
    });

    // Content form state (Hero)
    const [heroForm, setHeroForm] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        buttonText: 'Quero Imprimir',
        buttonLink: '#order-section'
    });

    useEffect(() => {
        if (settings) {
            setPricingForm({
                plaPricePerGram: settings.plaPricePerGram,
                petgPricePerGram: settings.petgPricePerGram,
                profitMargin: settings.profitMargin,
                machineCostPerHour: settings.machineCostPerHour,
                minimumOrder: settings.minimumOrder,
                maxPrintSize: settings.maxPrintSize || 250,
            });
        }
    }, [settings]);

    useEffect(() => {
        if (contentSections['hero']) {
            setHeroForm({
                title: contentSections['hero'].title || '',
                subtitle: contentSections['hero'].subtitle || '',
                imageUrl: contentSections['hero'].imageUrl || '',
                buttonText: contentSections['hero'].buttonText || 'Quero Imprimir',
                buttonLink: contentSections['hero'].buttonLink || '#order-section'
            });
        }
    }, [contentSections]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Senha incorreta');
        }
    };

    const handleSavePricing = async () => {
        try {
            await updateSettings(pricingForm);
            alert('Configurações salvas!');
        } catch (error) {
            alert('Erro ao salvar configurações');
        }
    };

    const handleAddColor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addColor(colorForm);
            setColorForm({ name: '', hex: '#3B82F6', material: 'PLA', isActive: true });
            alert('Cor adicionada!');
        } catch (error) {
            alert('Erro ao adicionar cor');
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addFeaturedItem({ ...itemForm, displayOrder: featuredItems.length + 1 });
            setItemForm({
                name: '',
                link: '',
                imageUrl: '',
                category: 'Geral',
                tag: 'Novo',
                description: '',
                weightEstimate: 50,
                isActive: true,
                displayOrder: 0,
            });
            alert('Item adicionado!');
        } catch (error) {
            alert('Erro ao adicionar item');
        }
    };

    const handleAddPortfolioItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addPortfolioItem(portfolioForm);
            setPortfolioForm({
                title: '',
                description: '',
                imageUrl: '',
                category: 'Geral',
                isActive: true,
            });
            alert('Item de portfólio adicionado!');
        } catch (error) {
            alert('Erro ao adicionar item ao portfólio');
        }
    };

    const handleSaveHero = async () => {
        try {
            await updateContentSection('hero', {
                title: heroForm.title,
                subtitle: heroForm.subtitle,
                imageUrl: heroForm.imageUrl,
                buttonText: heroForm.buttonText,
                buttonLink: heroForm.buttonLink
            });
            alert('Conteúdo Hero salvo!');
        } catch (error) {
            alert('Erro ao salvar conteúdo Hero');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Settings className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-gray-500 mt-2">Forge3D - Gerenciamento</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Senha de acesso"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative whitespace-nowrap ${activeTab === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
        >
            <Icon size={18} />
            {label}
            {activeTab === id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Settings className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Forge3D CMS</h1>
                            <p className="text-xs text-gray-500">Painel de Controle Completo</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1">
                        <TabButton id="pricing" icon={Settings} label="Preços & Config" />
                        <TabButton id="content" icon={Layout} label="Conteúdo Site" />
                        <TabButton id="portfolio" icon={Image} label="Portfólio" />
                        <TabButton id="colors" icon={Palette} label="Cores" />
                        <TabButton id="featured" icon={Star} label="Destaques" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'pricing' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações Gerais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preço PLA (R$/g)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={pricingForm.plaPricePerGram}
                                    onChange={(e) => setPricingForm({ ...pricingForm, plaPricePerGram: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preço PETG (R$/g)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={pricingForm.petgPricePerGram}
                                    onChange={(e) => setPricingForm({ ...pricingForm, petgPricePerGram: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Margem de Lucro (%)</label>
                                <input
                                    type="number"
                                    step="1"
                                    value={pricingForm.profitMargin}
                                    onChange={(e) => setPricingForm({ ...pricingForm, profitMargin: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Custo Máquina (R$/hora)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={pricingForm.machineCostPerHour}
                                    onChange={(e) => setPricingForm({ ...pricingForm, machineCostPerHour: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pedido Mínimo (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={pricingForm.minimumOrder}
                                    onChange={(e) => setPricingForm({ ...pricingForm, minimumOrder: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho Máx. Impressão (mm)</label>
                                <input
                                    type="number"
                                    step="1"
                                    value={pricingForm.maxPrintSize}
                                    onChange={(e) => setPricingForm({ ...pricingForm, maxPrintSize: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Ex: 250 para 25x25x25cm</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSavePricing}
                            className="mt-6 flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                        >
                            <Save size={18} />
                            Salvar Configurações
                        </button>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seção Hero (Topo do Site)</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
                                    <input
                                        type="text"
                                        value={heroForm.title}
                                        onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                                    <textarea
                                        value={heroForm.subtitle}
                                        onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem de Fundo</label>
                                    <input
                                        type="url"
                                        value={heroForm.imageUrl}
                                        onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                                        <input
                                            type="text"
                                            value={heroForm.buttonText}
                                            onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Link do Botão</label>
                                        <input
                                            type="text"
                                            value={heroForm.buttonLink}
                                            onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveHero}
                                    className="mt-4 flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                                >
                                    <Save size={18} />
                                    Salvar Hero
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'portfolio' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar ao Portfólio</h2>
                            <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Título do Projeto"
                                        value={portfolioForm.title}
                                        onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Categoria (ex: Cosplay, Peças)"
                                        value={portfolioForm.category}
                                        onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                    />
                                    <input
                                        type="url"
                                        placeholder="URL da Imagem"
                                        value={portfolioForm.imageUrl}
                                        onChange={(e) => setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="Descrição do projeto..."
                                    value={portfolioForm.description}
                                    onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                    rows={3}
                                />
                                <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
                                    Adicionar ao Portfólio
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {portfolioItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                                    <div className="aspect-video overflow-hidden bg-gray-100 relative">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">{item.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                        <button
                                            onClick={() => deletePortfolioItem(item.id)}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm"
                                        >
                                            <Trash2 size={16} />
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'colors' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Nova Cor</h2>
                            <form onSubmit={handleAddColor} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nome da cor"
                                    value={colorForm.name}
                                    onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    required
                                />
                                <input
                                    type="color"
                                    value={colorForm.hex}
                                    onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })}
                                    className="px-2 py-3 border border-gray-300 rounded-xl h-12"
                                />
                                <select
                                    value={colorForm.material}
                                    onChange={(e) => setColorForm({ ...colorForm, material: e.target.value as 'PLA' | 'PETG' })}
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                >
                                    <option value="PLA">PLA</option>
                                    <option value="PETG">PETG</option>
                                </select>
                                <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
                                    Adicionar
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {colors.map((color) => (
                                <div key={color.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg border-2 border-gray-200" style={{ backgroundColor: color.hex }}></div>
                                        <div>
                                            <p className="font-bold text-gray-900">{color.name}</p>
                                            <p className="text-sm text-gray-500">{color.material}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteColor(color.id)}
                                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'featured' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Item em Destaque</h2>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nome do item"
                                        value={itemForm.name}
                                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Categoria"
                                        value={itemForm.category}
                                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                    />
                                    <input
                                        type="url"
                                        placeholder="Link do modelo"
                                        value={itemForm.link}
                                        onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                        required
                                    />
                                    <input
                                        type="url"
                                        placeholder="URL da imagem"
                                        value={itemForm.imageUrl}
                                        onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tag"
                                        value={itemForm.tag}
                                        onChange={(e) => setItemForm({ ...itemForm, tag: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Peso estimado (g)"
                                        value={itemForm.weightEstimate}
                                        onChange={(e) => setItemForm({ ...itemForm, weightEstimate: parseFloat(e.target.value) })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl"
                                    />
                                </div>
                                <textarea
                                    placeholder="Descrição"
                                    value={itemForm.description}
                                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                    rows={3}
                                />
                                <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
                                    Adicionar Item
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{item.tag}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                        <button
                                            onClick={() => deleteFeaturedItem(item.id)}
                                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
