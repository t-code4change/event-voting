"use client"

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: 'vi' | 'en') => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const languages = [
    { code: 'vi', label: t('vi'), flag: '🇻🇳' },
    { code: 'en', label: t('en'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0A0A]/80 border border-[#FFD700]/20 text-[#FAF3E0] hover:bg-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all duration-200"
        aria-label={t('label')}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0A0A0A] border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/10 overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as 'vi' | 'en')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                locale === lang.code
                  ? 'bg-[#FFD700]/20 text-[#FFD700] border-l-2 border-[#FFD700]'
                  : 'text-[#FAF3E0] hover:bg-[#FFD700]/10 hover:text-[#FFD700]'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
              {locale === lang.code && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-[#FFD700]"
                >
                  ✓
                </motion.span>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
