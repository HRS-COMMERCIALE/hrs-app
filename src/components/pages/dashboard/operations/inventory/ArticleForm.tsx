'use client';

import { useState, useEffect } from 'react';
import { useCreateArticle, useUpdateArticle } from '@/hooks/useArticles';
import { useFamilies, useCreateFamily } from '@/hooks/useFamilies';
import { useSuppliers } from '@/hooks/useSuppliers';
import { ArticleItem } from '@/hooks/useArticles';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface ArticleFormProps {
  article?: ArticleItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ArticleForm({ article, onClose, onSuccess }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    article: '',
    familyId: '',
    codeBarre: '',
    marque: '',
    supplierId: '',
    fournisseur: '',
    typeArticle: 'product' as 'product' | 'service',
    majStock: true,
    maintenance: false,
    garantie: '',
    garantieUnite: '',
    natureArticle: 'local' as 'local' | 'importe',
    descriptifTechnique: '',
    ArticleStatus: true,
    Sale: false,
    Invoice: true,
    Serializable: false,
    qteDepart: '0',
    qteEnStock: '0',
    qteMin: '0',
    qteMax: '0',
    prixMP: '',
    prixAchatHT: '',
    fraisAchat: '',
    prixAchatBrut: '',
    pourcentageFODEC: '',
    FODEC: '',
    pourcentageTVA: '',
    TVASurAchat: '',
    prixAchatTTC: '',
    prixVenteBrut: '',
    pourcentageMargeBeneficiaire: '',
    margeBeneficiaire: '',
    prixVenteHT: '',
    pourcentageMaxRemise: '',
    remise: '',
    TVASurVente: '',
    prixVenteTTC: '',
    margeNet: '',
    TVAAPayer: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupplierListOpen, setIsSupplierListOpen] = useState(false);

  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const { data: familiesData, refetch: refetchFamilies } = useFamilies();
  const createFamilyMutation = useCreateFamily();
  const { data: suppliers } = useSuppliers();

  const isLoading = createArticleMutation.isPending || updateArticleMutation.isPending || createFamilyMutation.isPending;
  const isEditMode = !!article;

  useEffect(() => {
    if (article) {
      setFormData({
        article: article.article || '',
        familyId: article.familyId?.toString() || '',
        codeBarre: article.codeBarre || '',
        marque: article.marque || '',
        supplierId: article.supplierId?.toString() || '',
        fournisseur: article.fournisseur || '',
        typeArticle: article.typeArticle || 'product',
        majStock: article.majStock ?? true,
        maintenance: article.maintenance ?? false,
        garantie: article.garantie?.toString() || '',
        garantieUnite: article.garantieUnite || '',
        natureArticle: article.natureArticle || 'local',
        descriptifTechnique: article.descriptifTechnique || '',
        ArticleStatus: article.ArticleStatus ?? true,
        Sale: article.Sale ?? false,
        Invoice: article.Invoice ?? true,
        Serializable: article.Serializable ?? false,
        qteDepart: article.qteDepart?.toString() || '0',
        qteEnStock: article.qteEnStock?.toString() || '0',
        qteMin: article.qteMin?.toString() || '0',
        qteMax: article.qteMax?.toString() || '0',
        prixMP: article.prixMP?.toString() || '',
        prixAchatHT: article.prixAchatHT?.toString() || '',
        fraisAchat: article.fraisAchat?.toString() || '',
        prixAchatBrut: article.prixAchatBrut?.toString() || '',
        pourcentageFODEC: article.pourcentageFODEC?.toString() || '',
        FODEC: article.FODEC?.toString() || '',
        pourcentageTVA: article.pourcentageTVA?.toString() || '',
        TVASurAchat: article.TVASurAchat?.toString() || '',
        prixAchatTTC: article.prixAchatTTC?.toString() || '',
        prixVenteBrut: article.prixVenteBrut?.toString() || '',
        pourcentageMargeBeneficiaire: article.pourcentageMargeBeneficiaire?.toString() || '',
        margeBeneficiaire: article.margeBeneficiaire?.toString() || '',
        prixVenteHT: article.prixVenteHT?.toString() || '',
        pourcentageMaxRemise: article.pourcentageMaxRemise?.toString() || '',
        remise: article.remise?.toString() || '',
        TVASurVente: article.TVASurVente?.toString() || '',
        prixVenteTTC: article.prixVenteTTC?.toString() || '',
        margeNet: article.margeNet?.toString() || '',
        TVAAPayer: article.TVAAPayer?.toString() || '',
      });
      setImagePreview(article.imageUrl);
    }
  }, [article]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) return;
    
    try {
      const newFamily = await createFamilyMutation.mutateAsync({ name: newFamilyName.trim() });
      setFormData(prev => ({ ...prev, familyId: newFamily.id.toString() }));
      setNewFamilyName('');
      setShowFamilyModal(false);
      refetchFamilies();
    } catch (error) {
      console.error('Error creating family:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    try {
      const submitData = {
        ...formData,
        familyId: formData.familyId ? parseInt(formData.familyId) : null,
        supplierId: formData.supplierId ? parseInt(formData.supplierId) : null,
        garantie: formData.garantie ? parseInt(formData.garantie) : null,
        qteDepart: parseInt(formData.qteDepart),
        qteEnStock: parseInt(formData.qteEnStock),
        qteMin: parseInt(formData.qteMin),
        qteMax: parseInt(formData.qteMax),
        prixMP: formData.prixMP ? parseFloat(formData.prixMP) : null,
        prixAchatHT: formData.prixAchatHT ? parseFloat(formData.prixAchatHT) : null,
        fraisAchat: formData.fraisAchat ? parseFloat(formData.fraisAchat) : null,
        prixAchatBrut: formData.prixAchatBrut ? parseFloat(formData.prixAchatBrut) : null,
        pourcentageFODEC: formData.pourcentageFODEC ? parseFloat(formData.pourcentageFODEC) : null,
        FODEC: formData.FODEC ? parseFloat(formData.FODEC) : null,
        pourcentageTVA: formData.pourcentageTVA ? parseFloat(formData.pourcentageTVA) : null,
        TVASurAchat: formData.TVASurAchat ? parseFloat(formData.TVASurAchat) : null,
        prixAchatTTC: formData.prixAchatTTC ? parseFloat(formData.prixAchatTTC) : null,
        prixVenteBrut: formData.prixVenteBrut ? parseFloat(formData.prixVenteBrut) : null,
        pourcentageMargeBeneficiaire: formData.pourcentageMargeBeneficiaire ? parseFloat(formData.pourcentageMargeBeneficiaire) : null,
        margeBeneficiaire: formData.margeBeneficiaire ? parseFloat(formData.margeBeneficiaire) : null,
        prixVenteHT: formData.prixVenteHT ? parseFloat(formData.prixVenteHT) : null,
        pourcentageMaxRemise: formData.pourcentageMaxRemise ? parseFloat(formData.pourcentageMaxRemise) : null,
        remise: formData.remise ? parseFloat(formData.remise) : null,
        TVASurVente: formData.TVASurVente ? parseFloat(formData.TVASurVente) : null,
        prixVenteTTC: formData.prixVenteTTC ? parseFloat(formData.prixVenteTTC) : null,
        margeNet: formData.margeNet ? parseFloat(formData.margeNet) : null,
        TVAAPayer: formData.TVAAPayer ? parseFloat(formData.TVAAPayer) : null,
        image: imageFile,
      };

      if (article) {
        await updateArticleMutation.mutateAsync({ id: article.id, ...submitData });
      } else {
        await createArticleMutation.mutateAsync(submitData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error saving article:', error);
      setErrorMessage(error?.message || 'An error occurred while saving the article');
    }
  };

  const tabs = [
    { id: 'basic', name: 'Basic Info' },
    { id: 'pricing', name: 'Pricing' },
    { id: 'stock', name: 'Stock' },
    { id: 'advanced', name: 'Advanced' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border border-gray-200/50"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 p-6 border-b border-gray-100 rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-50"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#3c959d] to-[#ef7335] flex items-center justify-center shadow-lg">
                <Icon icon="solar:box-bold-duotone" className="text-white" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Article' : 'Add New Article'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isEditMode ? 'Update the article information below' : 'Complete the form below to add a new article'}
                </p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose} 
              className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all duration-200 shadow-sm"
            >
              <Icon icon="solar:close-circle-bold" width={20} height={20} />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#3c959d] text-[#3c959d]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon="solar:box-bold-duotone" className="h-4 w-4" />
                {tab.name}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Error Message */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon icon="solar:danger-circle-bold-duotone" className="text-red-500" width={20} height={20} />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="flex items-center gap-3 pb-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
                      <Icon icon="solar:box-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
                    </div>
                    <h4 className="text-base font-semibold text-gray-900">Basic Information</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#3c959d]/30 via-gray-200 to-[#ef7335]/30"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Article Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input 
                        type="text"
                        name="article"
                        value={formData.article}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                        placeholder="Enter article name"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <div className="relative group">
                      <select
                        name="typeArticle"
                        value={formData.typeArticle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none hover:border-[#3c959d]/50 hover:bg-white/70"
                      >
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#3c959d] transition-colors duration-200" width={16} height={16} />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Nature</label>
                    <div className="relative group">
                      <select
                        name="natureArticle"
                        value={formData.natureArticle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none hover:border-[#3c959d]/50 hover:bg-white/70"
                      >
                        <option value="local">Local</option>
                        <option value="importe">Imported</option>
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#3c959d] transition-colors duration-200" width={16} height={16} />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <div className="relative group">
                      <input 
                        type="text"
                        name="marque"
                        value={formData.marque}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                        placeholder="Enter brand name"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Family</label>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowFamilyModal(true)}
                        className="text-xs text-[#3c959d] hover:text-[#ef7335] font-medium flex items-center gap-1 transition-colors duration-200"
                      >
                        <Icon icon="solar:add-circle-bold-duotone" width={14} height={14} />
                        Create New
                      </motion.button>
                    </div>
                    <div className="relative group">
                      <select
                        name="familyId"
                        value={formData.familyId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none hover:border-[#3c959d]/50 hover:bg-white/70"
                      >
                        <option value="">Select Family</option>
                        {familiesData?.map((family) => (
                          <option key={family.id} value={family.id}>
                            {family.name}
                          </option>
                        ))}
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#3c959d] transition-colors duration-200" width={16} height={16} />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Barcode</label>
                    <div className="relative group">
                      <input 
                        type="text"
                        name="codeBarre"
                        value={formData.codeBarre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                        placeholder="Enter barcode"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                    <div className="relative group">
                      <input 
                        type="text"
                        name="fournisseur"
                        value={formData.fournisseur}
                        onChange={(e) => {
                          handleInputChange(e);
                          setIsSupplierListOpen(true);
                        }}
                        onFocus={() => setIsSupplierListOpen(true)}
                        onBlur={() => setTimeout(() => setIsSupplierListOpen(false), 150)}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                        placeholder="Enter supplier name or choose from list"
                        autoComplete="off"
                      />
                      {isSupplierListOpen && (formData.fournisseur?.trim()?.length ?? 0) >= 0 && (
                        <div className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                          {(suppliers || [])
                            .filter((s) => !formData.fournisseur || s.name.toLowerCase().includes(formData.fournisseur.toLowerCase()))
                            .slice(0, 50)
                            .map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, fournisseur: s.name }));
                                  setIsSupplierListOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              >
                                {s.name}
                              </button>
                            ))}
                          {suppliers && suppliers.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">No suppliers found</div>
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="md:col-span-2 space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Technical Description</label>
                    <div className="relative group">
                      <textarea
                        name="descriptifTechnique"
                        value={formData.descriptifTechnique}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                        placeholder="Enter technical description"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="md:col-span-2 space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Article Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center">
                            <Icon icon="solar:box-bold-duotone" className="text-[#3c959d]" width={32} height={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price (HT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="prixAchatHT"
                  value={formData.prixAchatHT}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Fees
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="fraisAchat"
                  value={formData.fraisAchat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Percentage
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    name="pourcentageTVA"
                    value={formData.pourcentageTVA || '0'}
                    onChange={handleInputChange}
                    className="flex-1 accent-[#3c959d]"
                  />
                  <span className="w-14 text-right text-sm text-gray-700">{formData.pourcentageTVA || '0'}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price (TTC)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="prixAchatTTC"
                  value={formData.prixAchatTTC}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (HT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="prixVenteHT"
                  value={formData.prixVenteHT}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (TTC)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="prixVenteTTC"
                  value={formData.prixVenteTTC}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Margin %
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    name="pourcentageMargeBeneficiaire"
                    value={formData.pourcentageMargeBeneficiaire || '0'}
                    onChange={handleInputChange}
                    className="flex-1 accent-[#3c959d]"
                  />
                  <span className="w-14 text-right text-sm text-gray-700">{formData.pourcentageMargeBeneficiaire || '0'}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Discount %
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    name="pourcentageMaxRemise"
                    value={formData.pourcentageMaxRemise || '0'}
                    onChange={handleInputChange}
                    className="flex-1 accent-[#3c959d]"
                  />
                  <span className="w-14 text-right text-sm text-gray-700">{formData.pourcentageMaxRemise || '0'}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Stock Tab */}
          {activeTab === 'stock' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Quantity
                </label>
                <input
                  type="number"
                  name="qteDepart"
                  value={formData.qteDepart}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  name="qteEnStock"
                  value={formData.qteEnStock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Quantity
                </label>
                <input
                  type="number"
                  name="qteMin"
                  value={formData.qteMin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Quantity
                </label>
                <input
                  type="number"
                  name="qteMax"
                  value={formData.qteMax}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="prixMP"
                  value={formData.prixMP}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty (Days)
                </label>
                <input
                  type="number"
                  name="garantie"
                  value={formData.garantie}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Unit
                </label>
                <select
                  name="garantieUnite"
                  value={formData.garantieUnite}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Unit</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Icon icon="solar:settings-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
                    Article Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="inline-flex items-center cursor-pointer select-none p-3 rounded-lg hover:bg-white/50 transition-colors">
                      <input
                        type="checkbox"
                        name="majStock"
                        checked={formData.majStock}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#3c959d] rounded-full relative transition-colors duration-200">
                        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </div>
                      <span className="ml-3 text-sm text-gray-900 font-medium">Update Stock</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer select-none p-3 rounded-lg hover:bg-white/50 transition-colors">
                      <input
                        type="checkbox"
                        name="maintenance"
                        checked={formData.maintenance}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#3c959d] rounded-full relative transition-colors duration-200">
                        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </div>
                      <span className="ml-3 text-sm text-gray-900 font-medium">Maintenance Required</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer select-none p-3 rounded-lg hover:bg-white/50 transition-colors">
                      <input
                        type="checkbox"
                        name="ArticleStatus"
                        checked={formData.ArticleStatus}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#3c959d] rounded-full relative transition-colors duration-200">
                        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </div>
                      <span className="ml-3 text-sm text-gray-900 font-medium">Article Active</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer select-none p-3 rounded-lg hover:bg-white/50 transition-colors">
                      <input
                        type="checkbox"
                        name="Sale"
                        checked={formData.Sale}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#3c959d] rounded-full relative transition-colors duration-200">
                        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </div>
                      <span className="ml-3 text-sm text-gray-900 font-medium">For Sale</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer select-none p-3 rounded-lg hover:bg-white/50 transition-colors">
                      <input
                        type="checkbox"
                        name="Invoice"
                        checked={formData.Invoice}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#3c959d] rounded-full relative transition-colors duration-200">
                        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </div>
                      <span className="ml-3 text-sm text-gray-900 font-medium">Invoice Required</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer select-none p-3 rounded-lg hover:bg-white/50 transition-colors">
                      <input
                        type="checkbox"
                        name="Serializable"
                        checked={formData.Serializable}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#3c959d] rounded-full relative transition-colors duration-200">
                        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </div>
                      <span className="ml-3 text-sm text-gray-900 font-medium">Serializable</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FODEC Percentage
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    name="pourcentageFODEC"
                    value={formData.pourcentageFODEC || '0'}
                    onChange={handleInputChange}
                    className="flex-1 accent-[#3c959d]"
                  />
                  <span className="w-14 text-right text-sm text-gray-700">{formData.pourcentageFODEC || '0'}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FODEC Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="FODEC"
                  value={formData.FODEC}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT on Purchase
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="TVASurAchat"
                  value={formData.TVASurAchat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Purchase Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="prixAchatBrut"
                  value={formData.prixAchatBrut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Selling Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="prixVenteBrut"
                  value={formData.prixVenteBrut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Margin Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="margeBeneficiaire"
                  value={formData.margeBeneficiaire}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="remise"
                  value={formData.remise}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT on Sale
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="TVASurVente"
                  value={formData.TVASurVente}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net Margin
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="margeNet"
                  value={formData.margeNet}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT to Pay
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="TVAAPayer"
                  value={formData.TVAAPayer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
          </form>
        </div>

        {/* Footer */}
        <div className="relative bg-gradient-to-r from-gray-50/80 to-gray-100/80 p-4 border-t border-gray-200/50 flex-shrink-0 rounded-b-3xl">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-gray-500">
              * Required fields
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose} 
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm whitespace-nowrap"
              >
                Cancel
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="solar:check-circle-bold-duotone" width={14} height={14} />
                {isLoading ? 'Saving...' : isEditMode ? 'Update Article' : 'Create Article'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Family Creation Modal */}
      <AnimatePresence>
        {showFamilyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 p-6 border-b border-gray-100 rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-50"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3c959d] to-[#ef7335] flex items-center justify-center shadow-lg">
                      <Icon icon="solar:folder-bold-duotone" className="text-white" width={20} height={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Create New Family</h3>
                      <p className="text-sm text-gray-600">Add a new product family</p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFamilyModal(false)} 
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all duration-200"
                  >
                    <Icon icon="solar:close-circle-bold" width={16} height={16} />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Family Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input 
                        type="text"
                        value={newFamilyName}
                        onChange={(e) => setNewFamilyName(e.target.value)}
                        placeholder="Enter family name"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateFamily();
                          }
                        }}
                        autoFocus
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative bg-gradient-to-r from-gray-50/80 to-gray-100/80 p-4 border-t border-gray-200/50 flex-shrink-0 rounded-b-2xl">
                <div className="flex items-center justify-end gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowFamilyModal(false)} 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={!newFamilyName.trim() || createFamilyMutation.isPending}
                    onClick={handleCreateFamily}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon="solar:check-circle-bold-duotone" width={14} height={14} />
                    {createFamilyMutation.isPending ? 'Creating...' : 'Create Family'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
