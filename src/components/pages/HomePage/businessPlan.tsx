'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '../../../store/languageStore';


interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  currency: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
}

const BusinessPlan: React.FC = () => {
  const router = useRouter();
  const { currentTranslations } = useLanguageStore();
  const language = currentTranslations.homePage.BusinessPlan;

  const content = {
    header: {
      badge: {
        icon: language.header.badge.icon,
        text: language.header.badge.text
      },
      title: language.header.title,
      subtitle: language.header.subtitle
    },
    pricingTiers: [
      {
        name: language.pricingTiers[0].name,
        price: '59.99',
        currency: 'HT',
        features: language.pricingTiers[0].features,
        buttonText: language.pricingTiers[0].buttonText
      },
      {
        name: language.pricingTiers[1].name,
        price: '129.00',
        currency: 'HT',
        features: language.pricingTiers[1].features,
        buttonText: language.pricingTiers[1].buttonText,
        popular: true
      },
      {
        name: language.pricingTiers[2].name,
        price: '270.00',
        currency: 'HT',
        features: language.pricingTiers[2].features,
        buttonText: language.pricingTiers[2].buttonText
      }
    ],
    customPlan: {
      name: language.customPlan.name,
      price: language.customPlan.price,
      description: language.customPlan.description,
      features: language.customPlan.features,
      buttonText: language.customPlan.buttonText
    },
    footer: {
      maintenance: language.footer.maintenance,
      pricing: language.footer.pricing,
      innovation: language.footer.innovation
    }
  };

  const pricingTiers: PricingTier[] = content.pricingTiers.map(tier => ({
    ...tier,
    features: tier.features.map(feature => ({ text: feature, included: true }))
  }));

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-r from-[#3c959d]/10 to-[#4ba5ad]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-[#ef7335]/10 to-[#3c959d]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-r from-[#4ba5ad]/10 to-[#ef7335]/10 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 backdrop-blur-sm border border-[#3c959d]/40 rounded-full px-6 py-3 text-sm mb-6 shadow-lg">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-gray-700 font-medium">{content.header.badge.icon} {content.header.badge.text}</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {content.header.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.header.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group flex flex-col ${
                tier.popular
                  ? 'border-blue-500 ring-4 ring-blue-100'
                  : 'border-gray-200 hover:border-[#3c959d]/50'
              }`}
            >
              {/* Card Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                tier.popular 
                  ? 'from-blue-500/5 to-blue-600/5' 
                  : 'from-[#3c959d]/5 to-[#ef7335]/5'
              } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6 relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-base text-gray-500 ml-1">
                    {tier.currency}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-6 flex-1 relative z-10">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                        feature.included
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={`text-xs ${
                        feature.included
                          ? 'text-gray-700'
                          : 'text-gray-500 line-through'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/register')}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 text-sm relative z-10 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white hover:shadow-lg hover:shadow-blue-500/25'
                    : 'bg-gray-100 text-gray-900 hover:bg-[#3c959d]/10 hover:border-[#3c959d]/50'
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}

          {/* Custom Plan Card */}
          <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-6 border-2 border-purple-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col group">
            {/* Card Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="text-center mb-6 relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">
                {content.customPlan.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-white">
                  {content.customPlan.price}
                </span>
              </div>
              <p className="text-purple-100 mt-1 text-sm">
                {content.customPlan.description}
              </p>
            </div>

            <ul className="space-y-2 mb-6 flex-1 relative z-10">
              {content.customPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-purple-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs text-purple-100">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => router.push('/register')}
              className="w-full py-2.5 px-4 rounded-lg font-semibold bg-white text-purple-600 hover:bg-purple-50 transition-colors duration-200 text-sm relative z-10 hover:shadow-lg hover:shadow-purple-500/25"
            >
              {content.customPlan.buttonText}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-600 mb-3 text-sm">
            {content.footer.maintenance}
          </p>
          <p className="text-xs text-gray-500">
            {content.footer.pricing}
          </p>
        </div>

        {/* Connection to Innovation */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 text-gray-500">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#3c959d]"></div>
            <span className="text-xs font-medium">{content.footer.innovation}</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#ef7335]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessPlan;