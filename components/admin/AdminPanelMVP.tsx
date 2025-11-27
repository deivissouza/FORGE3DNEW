import React, { useState } from 'react';
import { useAdmin } from '../../src/context/AdminContext';
import { Settings, Palette, Star, LogOut, Loader2, Save } from 'lucide-react';

export const AdminPanelMVP = () => {
    const { settings, colors, featuredItems, isLoading, updateSettings, addColor, updateColor, deleteColor, addFeaturedItem, updateFeaturedItem, deleteFeaturedItem } = useAdmin();
    const [activeTab, setActiveTab] = useState<'pricing' | 'colors' | 'featured'>('pricing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Pricing form state
    const [pricingForm, setPricingForm] = useState({
        plaPricePerGram: settings?.plaPricePerGram || 0.15,
        petgPricePerGram: settings?.petgPricePerGram || 0.20,
        profitMargin: settings?.profitMargin || 30,
        machineCostPerHour: settings?.machineCostPerHour || 5,
        minimumOrder: settings?.minimumOrder || 15,
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
        displayOrder: featuredItems.length + 1,
    });

    React.useEffect(() => {
        if (settings) {
            setPricingForm({
                plaPricePerGram: settings.plaPricePerGram,
                petgPricePerGram: settings.petgPricePerGram,
                profitMargin: settings.profitMargin,
                machineCostPerHour: settings.machineCostPerHour,
                minimumOrder: settings.minimumOrder,
            });
        }
    }, [settings]);

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
            await addFeaturedItem(itemForm);
            setItemForm({
                name: '',
                link: '',
                imageUrl: '',
                category: 'Geral',
                tag: 'Novo',
                description: '',
                weightEstimate: 50,
                isActive: true,
                displayOrder: featuredItems.length + 2,
            });
            alert('Item adicionado!');
        } catch (error) {
            alert('Erro ao adicionar item');
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
                            <h1 className="text-xl font-bold text-gray-900">Forge3D Admin</h1>
                            <p className="text-xs text-gray-500">Painel de Controle</p>
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
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('pricing')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === 'pricing'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Settings size={18} />
                            Preços
                            {activeTab === 'pricing' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('colors')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === 'colors'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Palette size={18} />
                            Cores
                            {activeTab === 'colors' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('featured')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === 'featured'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Star size={18} />
                            Itens em Destaque
                            {activeTab === 'featured' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'pricing' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações de Preço</h2>
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
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pedido Mínimo (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={pricingForm.minimumOrder}
                                    onChange={(e) => setPricingForm({ ...pricingForm, minimumOrder: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
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
