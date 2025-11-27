import React, { useState, useEffect } from 'react';
import { useStore } from '../src/context/StoreContext';
import { Lock, Save, LogOut, Plus, Trash2, Edit2, Image as ImageIcon, Link as LinkIcon, Phone } from 'lucide-react';
import { PopularModel } from '../types';

export const AdminPanel = () => {
    const { materials, updateMaterialPrice, addMaterial, deleteMaterial, popularModels, addModel, updateModel, deleteModel, contactInfo, updateContactInfo } = useStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'prices' | 'models' | 'contact'>('prices');

    // Model Form State
    const [isEditingModel, setIsEditingModel] = useState<string | null>(null);
    const [modelForm, setModelForm] = useState<Partial<PopularModel>>({
        name: '',
        description: '',
        imageUrl: '',
        link: '',
        tag: 'Novo',
        source: 'Printables',
        creator: ''
    });

    // Contact Form State
    const [contactForm, setContactForm] = useState({ name: '', phone: '' });

    // Material Form State
    const [isAddingMaterial, setIsAddingMaterial] = useState(false);
    const [materialForm, setMaterialForm] = useState({ name: '', pricePerGram: 0.15, description: '' });

    useEffect(() => {
        if (contactInfo) {
            setContactForm(contactInfo);
        }
    }, [contactInfo]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Senha incorreta');
        }
    };

    const handleSaveModel = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditingModel) {
            updateModel({ ...modelForm, id: isEditingModel } as PopularModel);
        } else {
            addModel({ ...modelForm, id: Date.now().toString() } as PopularModel);
        }
        resetModelForm();
    };

    const handleSaveContact = (e: React.FormEvent) => {
        e.preventDefault();
        updateContactInfo(contactForm);
        alert('Informações de contato atualizadas!');
    };

    const handleAddMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        addMaterial({
            id: materialForm.name.toLowerCase().replace(/\s+/g, '-'),
            name: materialForm.name,
            pricePerGram: materialForm.pricePerGram,
            description: materialForm.description
        });
        setIsAddingMaterial(false);
        setMaterialForm({ name: '', pricePerGram: 0.15, description: '' });
    };

    const startEditModel = (model: PopularModel) => {
        setIsEditingModel(model.id);
        setModelForm(model);
    };

    const resetModelForm = () => {
        setIsEditingModel(null);
        setModelForm({
            name: '',
            description: '',
            imageUrl: '',
            link: '',
            tag: 'Novo',
            source: 'Printables',
            creator: ''
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Área Administrativa</h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Senha de acesso"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-blue-500/30"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveTab('prices')}
                        className={`pb-4 px-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'prices' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Preços de Materiais
                        {activeTab === 'prices' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('models')}
                        className={`pb-4 px-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'models' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Destaques (Home)
                        {activeTab === 'models' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`pb-4 px-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'contact' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Contato
                        {activeTab === 'contact' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                    </button>
                </div>

                {activeTab === 'prices' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Gerenciar Preços</h2>
                                <p className="text-sm text-gray-500">Ajuste o valor do grama para cada material.</p>
                            </div>
                            <button
                                onClick={() => setIsAddingMaterial(!isAddingMaterial)}
                                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                                Novo Material
                            </button>
                        </div>

                        {isAddingMaterial && (
                            <div className="p-6 bg-blue-50 border-b border-blue-100 animate-fade-in">
                                <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                        <input
                                            type="text"
                                            required
                                            value={materialForm.name}
                                            onChange={e => setMaterialForm({ ...materialForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="Ex: PETG"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço/g (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={materialForm.pricePerGram}
                                            onChange={e => setMaterialForm({ ...materialForm, pricePerGram: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                        <input
                                            type="text"
                                            required
                                            value={materialForm.description}
                                            onChange={e => setMaterialForm({ ...materialForm, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="Ex: Resistente e durável"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Salvar</button>
                                        <button type="button" onClick={() => setIsAddingMaterial(false)} className="px-3 bg-gray-200 rounded-lg hover:bg-gray-300">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        )}
                        <ul className="divide-y divide-gray-100">
                            {materials.map((material) => (
                                <li key={material.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{material.name}</p>
                                            <p className="text-sm text-gray-500">{material.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="text-sm font-medium text-gray-700">Preço por grama (R$)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={material.pricePerGram}
                                                onChange={(e) => updateMaterialPrice(material.id, parseFloat(e.target.value))}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-right font-mono"
                                            />
                                            <button
                                                onClick={() => deleteMaterial(material.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir Material"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'models' && (
                    <div className="space-y-8">
                        {/* Add/Edit Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">{isEditingModel ? 'Editar Modelo' : 'Adicionar Novo Destaque'}</h2>
                            <form onSubmit={handleSaveModel} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Modelo</label>
                                    <input
                                        type="text"
                                        required
                                        value={modelForm.name}
                                        onChange={e => setModelForm({ ...modelForm, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                        placeholder="Ex: Dummy 13"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Criador</label>
                                    <input
                                        type="text"
                                        required
                                        value={modelForm.creator}
                                        onChange={e => setModelForm({ ...modelForm, creator: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                        placeholder="Ex: Soozafone"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            required
                                            value={modelForm.imageUrl}
                                            onChange={e => setModelForm({ ...modelForm, imageUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                            placeholder="https://..."
                                        />
                                        {modelForm.imageUrl && (
                                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img src={modelForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link do Modelo (Printables/Thingiverse)</label>
                                    <input
                                        type="url"
                                        required
                                        value={modelForm.link}
                                        onChange={e => setModelForm({ ...modelForm, link: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                        placeholder="https://www.printables.com/model/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Etiqueta)</label>
                                    <input
                                        type="text"
                                        value={modelForm.tag}
                                        onChange={e => setModelForm({ ...modelForm, tag: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fonte</label>
                                    <select
                                        value={modelForm.source}
                                        onChange={e => setModelForm({ ...modelForm, source: e.target.value as PopularModel['source'] })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    >
                                        <option value="Printables">Printables</option>
                                        <option value="Thingiverse">Thingiverse</option>
                                        <option value="MakerWorld">MakerWorld</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>

                                <div className="col-span-2 flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        {isEditingModel ? 'Salvar Alterações' : 'Adicionar Modelo'}
                                    </button>
                                    {isEditingModel && (
                                        <button
                                            type="button"
                                            onClick={resetModelForm}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Models List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {popularModels.map((model) => (
                                <div key={model.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex">
                                    <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                                        <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{model.name}</h3>
                                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{model.source}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-1">{model.link}</p>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => startEditModel(model)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteModel(model.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Informações de Contato</h2>
                        <form onSubmit={handleSaveContact} className="max-w-md space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome para Contato</label>
                                <input
                                    type="text"
                                    required
                                    value={contactForm.name}
                                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Ex: Deivis"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                <input
                                    type="text"
                                    required
                                    value={contactForm.phone}
                                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Ex: 5511985455659"
                                />
                                <p className="text-xs text-gray-500 mt-1">Insira apenas números, incluindo o código do país (55).</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Salvar Contato
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
