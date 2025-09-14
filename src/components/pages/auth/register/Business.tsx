'use client';

import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { Building2, Globe, Hash, Users, Upload, Gift } from 'lucide-react';

const INDUSTRY_OPTIONS: string[] = [
    'Software',
    'Retail',
    'Manufacturing',
    'Healthcare',
    'Finance',
    'Education',
    'Logistics',
    'Real Estate',
    'Construction',
    'Hospitality',
    'E-commerce',
    'Consulting',
    'Telecommunications',
    'Energy',
    'Automotive',
    'Agriculture',
    'Media',
    'Pharmaceuticals',
    'Aerospace',
    'Nonprofit',
];

// Stable, top-level components to avoid remounts that cause input focus loss
    const InputField = memo(({ icon: Icon, label, id, name, type = "text", required = false, placeholder, value, onChange, children, autoComplete }: any) => (
        <div className="space-y-1.5">
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Icon className="w-4 h-4 text-[#3c959d]" />
                {label}
                {required && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                        Required
                    </span>
                )}
            </label>
            {children || (
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onInput={onChange}
                    required={required}
                    aria-required={required}
                    autoComplete={autoComplete}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                    placeholder={placeholder}
                />
            )}
        </div>
    ));

    

export interface BusinessData {
    businessName: string;
    registrationNumber?: string;
    taxId: string;
    industry: string;
    currency: string;
    size: string;
    website?: string;
    cnssCode?: string;
    documentHeaderColor: string;
    tableHeaderBackgroundColor: string;
    tableHeaderTitleColor: string;
    referralCode?: string;
    logoFile?: File | null;
}

type BusinessFormProps = {
    initialValues?: Partial<BusinessData>;
    onSubmit: (data: BusinessData) => void;
    onChange?: (data: Partial<BusinessData>) => void;
};

export default function BusinessForm({ initialValues, onSubmit, onChange }: BusinessFormProps) {
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<BusinessData>({
        businessName: initialValues?.businessName ?? '',
        registrationNumber: (initialValues as any)?.registrationNumber ?? '',
        taxId: (initialValues as any)?.taxId ?? '',
        industry: initialValues?.industry ?? '',
        currency: (initialValues as any)?.currency ?? 'TND',
        size: initialValues?.size ?? '10-50',
        website: initialValues?.website ?? '',
        cnssCode: (initialValues as any)?.cnssCode ?? '',
        documentHeaderColor: (initialValues as any)?.documentHeaderColor ?? '#1a8ea5',
        tableHeaderBackgroundColor: (initialValues as any)?.tableHeaderBackgroundColor ?? '#fafafa',
        tableHeaderTitleColor: (initialValues as any)?.tableHeaderTitleColor ?? '#1a8ea5',
        referralCode: (initialValues as any)?.referralCode ?? '',
        logoFile: (initialValues as any)?.logoFile ?? null,
    });

    const rootRef = useRef<HTMLDivElement | null>(null);
    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // Update logo preview when initialValues.logoFile changes
    useEffect(() => {
        if (initialValues?.logoFile) {
            // If we have a logoFile in initialValues, create a preview URL
            if (initialValues.logoFile instanceof File) {
                const reader = new FileReader();
                reader.onload = () => setLogoPreviewUrl(reader.result as string);
                reader.readAsDataURL(initialValues.logoFile);
            }
        }
    }, [initialValues?.logoFile]);

    // Ensure defaults like currency and size are reflected in parent state on mount
    useEffect(() => {
        if (!onChange) return;
        onChange({
            currency: formData.currency,
            size: formData.size,
            industry: formData.industry,
            logoFile: formData.logoFile, // Include logoFile in initial change
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced change propagation to container
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const emitChange = useCallback((partial: Partial<BusinessData>) => {
        if (!onChange) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            onChange(partial);
        }, 200);
    }, [onChange]);

    // Sync values that the browser may autofill so they count towards validation
    useEffect(() => {
        const syncFromDom = () => {
            const ids = ['businessName', 'registrationNumber', 'taxId', 'cnssCode', 'website', 'size', 'currency'] as const;
            const partial: Partial<BusinessData> = {};
            ids.forEach((fieldId) => {
                const el = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | null;
                if (!el) return;
                const domValue = (el as any).value ?? '';
                const currentValue = (formDataRef.current as any)[fieldId] ?? '';
                if (domValue !== currentValue) {
                    (partial as any)[fieldId] = domValue;
                }
            });
            if (Object.keys(partial).length > 0) {
                setFormData((prev) => {
                    const next = { ...prev, ...partial } as BusinessData;
                    emitChange(partial);
                    return next;
                });
            }
        };

        const timers: Array<ReturnType<typeof setTimeout>> = [
            setTimeout(syncFromDom, 0),
            setTimeout(syncFromDom, 500),
            setTimeout(syncFromDom, 1500),
        ];

        const node = rootRef.current;
        const handler = () => syncFromDom();
        node?.addEventListener('input', handler, true);
        node?.addEventListener('change', handler, true);
        document.addEventListener('visibilitychange', handler);

        return () => {
            timers.forEach((t) => clearTimeout(t));
            node?.removeEventListener('input', handler, true);
            node?.removeEventListener('change', handler, true);
            document.removeEventListener('visibilitychange', handler);
        };
    }, [emitChange]);

    // Debug logging for form validation
    useEffect(() => {
    }, [formData]);

    // Debounced change propagation to container

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value } as BusinessData;
            emitChange({ [name]: value } as Partial<BusinessData>);
            return next;
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFormData(prev => {
            const next = { ...prev, logoFile: file ?? null } as BusinessData;
            emitChange({ logoFile: file ?? null });
            return next;
        });
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setLogoPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setLogoPreviewUrl(null);
        }
    };

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        const requiredMissing = [
            formData.businessName.trim(),
            formData.taxId.trim(),
            formData.industry.trim(),
            formData.currency.trim(),
            formData.size.trim(),
            (formData.cnssCode ?? '').trim(),
        ].some(v => !v);

        if (requiredMissing) {
            setError('Please fill all required fields');
            return;
        }

        setError(null);
        onSubmit({
            businessName: formData.businessName.trim(),
            taxId: formData.taxId.trim(),
            industry: formData.industry.trim(),
            currency: formData.currency,
            size: formData.size,
            website: formData.website?.trim() || '',
            cnssCode: formData.cnssCode?.trim() || '',
            documentHeaderColor: formData.documentHeaderColor,
            tableHeaderBackgroundColor: formData.tableHeaderBackgroundColor,
            tableHeaderTitleColor: formData.tableHeaderTitleColor,
            referralCode: formData.referralCode?.trim() || '',
            logoFile: formData.logoFile ?? null,
        });
    };

    // Industry dropdown state and behaviors
    const [isIndustryOpen, setIsIndustryOpen] = useState(false);
    const [industryQuery, setIndustryQuery] = useState('');
    const industryRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (industryRef.current && !industryRef.current.contains(e.target as Node)) {
                setIsIndustryOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const filteredIndustries = INDUSTRY_OPTIONS.filter(opt =>
        opt.toLowerCase().includes(industryQuery.toLowerCase())
    );

    

    return (
        <div ref={rootRef} className="max-w-none mx-auto">
            {/* Header moved to container for consistency */}

            <div className="">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Main Business Info */}
                        <div className="xl:col-span-2 space-y-5">
                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-[#3c959d]" />
                                    Company Details
                                </h2>
                                
                                <div className="space-y-5">
                                    <InputField
                                        icon={Building2}
                                        label="Company Name"
                                        id="businessName"
                                        name="businessName"
                                        required
                                        placeholder="Enter your company name"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        autoComplete="organization"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <InputField
                                            icon={Hash}
                                            label="Registration Number"
                                            id="registrationNumber"
                                            name="registrationNumber"
                                            placeholder="TN-123456"
                                            value={formData.registrationNumber ?? ''}
                                            onChange={handleChange}
                                            autoComplete="off"
                                        />
                                        <InputField
                                            icon={Hash}
                                            label="Tax ID"
                                            id="taxId"
                                            name="taxId"
                                            required
                                            placeholder="1234567/A/M/000"
                                            value={formData.taxId}
                                            onChange={handleChange}
                                            autoComplete="off"
                                        />
                                        
                                        <InputField
                                            icon={Hash}
                                            label="CNSS Code"
                                            id="cnssCode"
                                            name="cnssCode"
                                            required
                                            placeholder="000000-00"
                                            value={formData.cnssCode}
                                            onChange={handleChange}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <InputField
                                        icon={Building2}
                                        label="Industry Sector"
                                        id="industry"
                                        name="industry"
                                        required
                                        placeholder="Software, Retail, Manufacturing, etc."
                                        value={formData.industry}
                                        onChange={handleChange}
                                    >
                                        <div className="relative" ref={industryRef}>
                                            <div
                                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all duration-200 hover:border-slate-300 focus-within:border-[#3c959d] focus-within:ring-4 focus-within:ring-[#3c959d]/10 cursor-pointer flex items-center justify-between"
                                                onClick={() => setIsIndustryOpen(prev => !prev)}
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        setIsIndustryOpen(prev => !prev);
                                                    }
                                                }}
                                            >
                                                <span className={formData.industry ? 'text-slate-900' : 'text-slate-400'}>
                                                    {formData.industry || 'Software, Retail, Manufacturing, etc.'}
                                                </span>
                                                <svg className={`h-4 w-4 ml-3 transition-transform ${isIndustryOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.853a.75.75 0 111.08 1.04l-4.24 4.4a.75.75 0 01-1.08 0l-4.24-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                                </svg>
                                            </div>

                                            {isIndustryOpen && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border-2 border-slate-200 rounded-xl shadow-xl">
                                                    <div className="p-2 border-b border-slate-100">
                                                        <input
                                                            type="text"
                                                            value={industryQuery}
                                                            onChange={(e) => setIndustryQuery(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    const choice = filteredIndustries[0] ?? industryQuery.trim();
                                                                    if (choice) {
                                                                        setFormData(prev => {
                                                                            const next = { ...prev, industry: choice } as BusinessData;
                                                                            emitChange({ industry: choice });
                                                                            return next;
                                                                        });
                                                                        setIsIndustryOpen(false);
                                                                        setIndustryQuery('');
                                                                    }
                                                                }
                                                            }}
                                                            placeholder="Search industries..."
                                                            autoFocus
                                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/20"
                                                        />
                                                    </div>
                                                    <ul className="max-h-56 overflow-auto p-2">
                                                        {filteredIndustries.length > 0 ? (
                                                            filteredIndustries.map((option) => (
                                                                <li
                                                                    key={option}
                                                                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-50 ${option === formData.industry ? 'bg-slate-100 font-semibold' : 'text-slate-700'}`}
                                                                    onClick={() => {
                                                                        setFormData(prev => {
                                                                            const next = { ...prev, industry: option } as BusinessData;
                                                                            emitChange({ industry: option });
                                                                            return next;
                                                                        });
                                                                        setIsIndustryOpen(false);
                                                                        setIndustryQuery('');
                                                                    }}
                                                                >
                                                                    {option}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-3 py-6 text-center text-sm text-slate-400">No results</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </InputField>
                                    
                                    <InputField
                                        icon={Globe}
                                        label="Website"
                                        id="website"
                                        name="website"
                                        type="url"
                                        placeholder="https://www.company.com"
                                        value={formData.website}
                                        onChange={handleChange}
                                        autoComplete="url"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <InputField
                                            icon={Users}
                                            label="Company Size"
                                            id="size"
                                            name="size"
                                            required
                                            value={formData.size}
                                            onChange={handleChange}
                                        >
                                            <select
                                                id="size"
                                                name="size"
                                                value={formData.size}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                required
                                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                                            >
                                                <option value="1-9">1 to 9 employees</option>
                                                <option value="10-50">10 to 50 employees</option>
                                                <option value="51-200">51 to 200 employees</option>
                                                <option value="201-500">201 to 500 employees</option>
                                                <option value="500+">500+ employees</option>
                                            </select>
                                        </InputField>

                                        <InputField
                                            icon={Hash}
                                            label="Currency"
                                            id="currency"
                                            name="currency"
                                            required
                                            value={formData.currency}
                                            onChange={handleChange}
                                        >
                                            <select
                                                id="currency"
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                required
                                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                                            >
                                                <option value="TND">🇹🇳 Tunisian Dinar (TND)</option>
                                                <option value="USD">🇺🇸 US Dollar (USD)</option>
                                                <option value="EUR">🇪🇺 Euro (EUR)</option>
                                            </select>
                                        </InputField>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information removed */}
                        </div>

                        {/* Logo Upload */}
                        <div className="xl:col-span-1 space-y-5">
                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-[#3c959d]" />
                                    Company Logo
                                </h2>
                                
                                <div className="space-y-3">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative group">
                                            <div className="h-32 w-32 rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:border-[#3c959d] group-hover:bg-slate-50">
                                                {logoPreviewUrl ? (
                                                    <img 
                                                        src={logoPreviewUrl} 
                                                        alt="Logo preview" 
                                                        className="h-full w-full object-contain p-2" 
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                                        <span className="text-xs text-slate-500 font-medium">Upload Logo</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={handleFileChange} 
                                            />
                                            <Upload className="w-4 h-4" />
                                            Choose File
                                        </label>
                                        
                                        <p className="text-xs text-slate-500 text-center">
                                            Recommended: PNG or JPG<br />
                                            Max file size: 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Code */}
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                                <InputField
                                    icon={Gift}
                                    label="Referral Code"
                                    id="referralCode"
                                    name="referralCode"
                                    placeholder="Enter referral code"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                                    <Gift className="w-3 h-3" />
                                    Get special benefits with a referral code
                                </p>
                            </div>
                        </div>

                        {/* Brand Colors removed */}
                    </div>

                    {/* Inline error; submission handled by container Next button */}
                    <div className="mt-4">
                        {error && (
                            <div className="text-sm text-red-600" aria-live="polite">{error}</div>
                        )}
                    </div>
                </div>
            </div>
    );
}