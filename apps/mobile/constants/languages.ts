export interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    id: 'english',
    name: 'English',
    nativeName: 'English',
  },
  {
    id: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
  },
  {
    id: 'kannada',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
  },
  {
    id: 'tamil',
    name: 'Tamil',
    nativeName: 'தமிழ்',
  },
  {
    id: 'telugu',
    name: 'Telugu',
    nativeName: 'తెలుగు',
  },
  {
    id: 'malayalam',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
  },
  {
    id: 'marathi',
    name: 'Marathi',
    nativeName: 'मराठी',
  },
  {
    id: 'bengali',
    name: 'Bengali',
    nativeName: 'বাংলা',
  },
];

export const DEFAULT_LANGUAGE = 'english';
