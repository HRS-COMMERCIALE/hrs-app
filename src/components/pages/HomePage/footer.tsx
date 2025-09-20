'use client';

import React from 'react';
import { companyInfo } from '../../../libs/config/companyInfo';
import { useI18n } from '@/i18n/hooks';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { tNested } = useI18n();
  const language = tNested('homePage.footer');

  const content = {
    company: {
      name: language('company.name'),
      tagline: language('company.tagline'),
      description: language('company.description'),
      logoAlt: language('company.logoAlt')
    },
    quickMenu: {
      title: language('quickMenu.title'),
      items: [
        { label: language('quickMenu.items.home'), href: "/", icon: "home" },
        { label: language('quickMenu.items.businessPlans'), href: "/businessPlans", icon: "business" },
        { label: language('quickMenu.items.about'), href: "#about", icon: "about" },
        { label: language('quickMenu.items.contact'), href: "/contactUs", icon: "contact" },
        { label: language('quickMenu.items.features'), href: "#features", icon: "features" }
      ]
    },
    contactInfo: {
      title: language('contactInfo.title'),
      email: {
        label: language('contactInfo.email'),
        value: companyInfo.contact.email.value
      },
      phone: {
        label: language('contactInfo.phone'),
        numbers: companyInfo.contact.phone.numbers
      },
      address: {
        label: language('contactInfo.address'),
        lines: companyInfo.contact.address.lines
      }
    },
    location: {
      title: language('location.title'),
      city: language('location.city'),
      subtitle: language('location.subtitle'),
      mapPlaceholder: language('location.mapPlaceholder')
    },
    footer: {
      copyright: `© ${currentYear} ${language('legal.copyright')}`,
      links: [
        language('legal.links.privacy'),
        language('legal.links.terms'),
        language('legal.links.cookies')
      ]
    }
  };

  return (
    <footer className="bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-[#3c959d]/5 to-[#4ba5ad]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-[#ef7335]/5 to-[#3c959d]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <img 
                  src="/logo.png" 
                  alt={content.company.logoAlt}
                  className="h-10 w-auto object-contain mr-3"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{content.company.name}</h3>
                  <p className="text-sm text-slate-300">{content.company.tagline}</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                {content.company.description}
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <a href={companyInfo.socialMedia.twitter} className="w-10 h-10 bg-slate-700 hover:bg-[#3c959d] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href={companyInfo.socialMedia.facebook} className="w-10 h-10 bg-slate-700 hover:bg-[#3c959d] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href={companyInfo.socialMedia.linkedin} className="w-10 h-10 bg-slate-700 hover:bg-[#3c959d] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href={companyInfo.socialMedia.instagram} className="w-10 h-10 bg-slate-700 hover:bg-[#3c959d] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Menu */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">{content.quickMenu.title}</h4>
              <ul className="space-y-3">
                {content.quickMenu.items.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-slate-300 hover:text-[#3c959d] transition-colors duration-300 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">{content.contactInfo.title}</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#3c959d] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-slate-300 text-sm">{content.contactInfo.email.label}</p>
                    <a href={`mailto:${content.contactInfo.email.value}`} className="text-white hover:text-[#3c959d] transition-colors duration-300">
                      {content.contactInfo.email.value}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#3c959d] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-slate-300 text-sm">{content.contactInfo.phone.label}</p>
                    <div className="space-y-1">
                      {content.contactInfo.phone.numbers.map((number, index) => (
                        <a key={index} href={`tel:${number ? number.replace(/\s/g, '') : ''}`} className="text-white hover:text-[#3c959d] transition-colors duration-300 block">
                          {number}
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#3c959d] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-slate-300 text-sm">{content.contactInfo.address.label}</p>
                    <p className="text-white">
                      {content.contactInfo.address.lines.map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < content.contactInfo.address.lines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">{content.location.title}</h4>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Map Placeholder with Tunisian Location */}
                  <div className="text-center text-slate-300">
                    <svg className="w-16 h-16 mx-auto mb-3 text-[#3c959d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm font-medium">{content.location.city}</p>
                    <p className="text-xs text-slate-400">{content.location.subtitle}</p>
                  </div>
                  
                  {/* Location Pin */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-[#ef7335] rounded-full border-2 border-white shadow-lg"></div>
                    <div className="w-2 h-2 bg-[#ef7335] rounded-full border border-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  {content.location.mapPlaceholder}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              {content.footer.copyright}
            </div>
            
            <div className="flex space-x-6 text-sm">
              {content.footer.links.map((link, index) => (
                <a key={index} href="#" className="text-slate-400 hover:text-[#3c959d] transition-colors duration-300">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
