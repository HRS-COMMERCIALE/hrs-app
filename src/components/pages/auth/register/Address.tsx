'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MapPin, Phone, Printer, Building, Globe } from 'lucide-react';

export interface AddressData {
    country: string;
    governorate: string;
    postalCode: string;
    address: string;
    phone: string;
    fax?: string;
}

type AddressFormProps = {
    initialValues?: Partial<AddressData>;
    onSubmit: (data: AddressData) => void;
    onChange?: (data: Partial<AddressData>) => void;
};

export default function AddressForm({ initialValues, onSubmit, onChange }: AddressFormProps) {
    const tunisianGovernorates = [
        'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja', 'Jendouba',
        'Kef', 'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia',
        'Sfax', 'Gafsa', 'Tozeur', 'Kebili', 'Gabes', 'Medenine', 'Tataouine'
    ];

    const [formData, setFormData] = useState<AddressData>({
        country: initialValues?.country ?? 'Tunisia',
        governorate: (initialValues as any)?.governorate ?? '',
        postalCode: initialValues?.postalCode ?? '',
        address: (initialValues as any)?.address ?? '',
        phone: (initialValues as any)?.phone ?? '',
        fax: (initialValues as any)?.fax ?? '',
    });

    // Debounced change propagation to container
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const emitChange = useCallback((partial: Partial<AddressData>) => {
        if (!onChange) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            onChange(partial);
        }, 200);
    }, [onChange]);

    // Emit initial values (including defaults like country) on mount
    useEffect(() => {
        emitChange(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value } as AddressData;
            // Emit the full current form state so CollectedData stays comprehensive
            emitChange(next);
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            country: formData.country.trim(),
            governorate: formData.governorate.trim(),
            postalCode: formData.postalCode.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim(),
            fax: formData.fax?.trim() || '',
        });
    };

    return (
        <div className="max-w-none mx-auto min-h-[520px]">
            {/* Header moved to container for consistency */}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Location Details */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#3c959d]" />
                        Location Details
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="country" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Globe className="w-4 h-4 text-[#3c959d]" />
                                Country
                                <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                            >
                                <option value="Tunisia">🇹🇳 Tunisia</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="governorate" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Building className="w-4 h-4 text-[#3c959d]" />
                                Governorate
                                <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <select
                                id="governorate"
                                name="governorate"
                                value={formData.governorate}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                            >
                                <option value="" disabled>Choose governorate</option>
                                {tunisianGovernorates.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="postalCode" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <MapPin className="w-4 h-4 text-[#3c959d]" />
                                Postal Code
                                <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <input
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                                placeholder="e.g., 1000"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <MapPin className="w-4 h-4 text-[#3c959d]" />
                            Full Address
                            <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                Required
                            </span>
                        </label>
                        <input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                            placeholder="Street address, building number, floor, etc."
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[#3c959d]" />
                        Contact Information
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Phone className="w-4 h-4 text-[#3c959d]" />
                                Telephone
                                <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                                placeholder="+216 XX XXX XXX"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="fax" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Printer className="w-4 h-4 text-[#3c959d]" />
                                Fax (Optional)
                            </label>
                            <input
                                id="fax"
                                name="fax"
                                value={formData.fax}
                                onChange={handleChange}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-4 focus:ring-[#3c959d]/10 focus:shadow-lg"
                                placeholder="+216 XX XXX XXX"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit handled by Next button in container */}
            </form>
        </div>
    );
}


