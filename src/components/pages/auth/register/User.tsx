'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Lock, UserCheck } from 'lucide-react';

export interface UserData {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    landline?: string;
    password: string;
}

type UserFormProps = {
    initialValues?: Partial<UserData>;
    onSubmit: (data: UserData) => void;
    onChange?: (data: Partial<UserData>) => void;
};

export default function UserForm({ initialValues, onSubmit, onChange }: UserFormProps) {
    const [formData, setFormData] = useState<UserData>({
        title: (initialValues as any)?.title ?? (initialValues as any)?.status ?? 'Mr',
        firstName: initialValues?.firstName ?? '',
        lastName: initialValues?.lastName ?? '',
        email: initialValues?.email ?? '',
        mobile: initialValues?.mobile ?? '',
        landline: initialValues?.landline ?? '',
        password: initialValues?.password ?? '',
    });

    // Debounced change propagation to container
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const emitChange = useCallback((partial: Partial<UserData>) => {
        if (!onChange) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            onChange(partial);
        }, 200);
    }, [onChange]);

    // Emit initial values (including defaults) on mount
    useEffect(() => {
        emitChange(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        let { value } = e.target as HTMLInputElement | HTMLSelectElement;
        if (name === 'mobile' || name === 'landline') {
            value = String(value).replace(/\D/g, '');
        }
        setFormData(prev => {
            const next = { ...prev, [name]: value } as UserData;
            // Emit the full current form state so CollectedData stays comprehensive
            emitChange(next);
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            title: formData.title,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            landline: formData.landline?.trim() || '',
            password: formData.password,
        });
    };

    return (
        <div className="max-w-none mx-auto min-h-[520px]">
            {/* Header moved to container for consistency */}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Details Section - All fields consolidated */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#3c959d]" />
                        Personal Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                <UserIcon className="w-3 h-3 text-[#3c959d]" />
                                Title
                                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <select
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                            >
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="firstName" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                <UserIcon className="w-3 h-3 text-[#3c959d]" />
                                First Name
                                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                                placeholder="John"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="lastName" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                <UserIcon className="w-3 h-3 text-[#3c959d]" />
                                Last Name
                                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                                placeholder="Doe"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                <Mail className="w-3 h-3 text-[#3c959d]" />
                                Email Address
                                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                                placeholder="john.doe@example.com"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="mobile" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                <Phone className="w-3 h-3 text-[#3c959d]" />
                                Mobile Phone
                                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                                placeholder="+216 XX XXX XXX"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="landline" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                <Phone className="w-3 h-3 text-[#3c959d]" />
                                Landline (Optional)
                            </label>
                            <input
                                id="landline"
                                name="landline"
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.landline}
                                onChange={handleChange}
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                                placeholder="+216 XX XXX XXX"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label htmlFor="password" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                <Lock className="w-3 h-3 text-[#3c959d]" />
                                Password
                                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit handled by Next button in container */}
            </form>
        </div>
    );
}


