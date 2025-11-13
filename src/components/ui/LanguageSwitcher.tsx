import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './button';
import { LANGUAGE_STORAGE_KEY } from '@/i18n';
import { Globe } from 'lucide-react';

// Native script names for languages - these are NOT translated
const languages = [
  { code: 'en', nativeName: 'English' },
  { code: 'si', nativeName: 'සිංහල' },
  { code: 'ta', nativeName: 'தமிழ்' },
] as const;

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

const LanguageSwitcher = ({ variant = 'dark' }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const activeLanguageLabel = useMemo(() => {
    const active = languages.find((lang) => lang.code === currentLanguage) ?? languages[0];
    return active.nativeName;
  }, [currentLanguage]);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  };

  // Button styling based on variant
  const buttonClassName = variant === 'dark' 
    ? 'flex items-center gap-2 text-white hover:text-white hover:bg-green-500/20'
    : 'flex items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-100';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={buttonClassName}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{activeLanguageLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('languageSwitcher.menuTitle')}</DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? 'font-medium' : ''}
          >
            {lang.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

