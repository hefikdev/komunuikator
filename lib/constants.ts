// Stałe aplikacji

// Wiadomości systemowe
export const WIADOMOSCI = {
  PLIK_WYSLANY: 'Wysłano plik',
  WITAJ: 'Witaj',
  BRAK_POKOJU: 'Wybierz pokój, aby rozpocząć czat',
} as const

// Limity
export const LIMITY = {
  MAX_ROZMIAR_PLIKU: 10 * 1024 * 1024, // 10MB
  MAX_WIADOMOSCI: 100,
  INTERWAL_ODSWIEZANIA: 2000, // 2 sekundy
} as const

// Dozwolone typy plików
export const DOZWOLONE_TYPY_PLIKOW = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]

// Emotikony
export const EMOTIKONY = [
  '😀', '😂', '😍', '👍', '❤️', '🎉', 
  '🔥', '💯', '😎', '🤔', '👏', '🙏'
]

// Walidacja
export const WALIDACJA = {
  MIN_DLUGOSC_HASLA: 6,
  MIN_DLUGOSC_LOGINU: 3,
  MAX_DLUGOSC_LOGINU: 20,
  REGEX_LOGIN: /^[a-zA-Z0-9_]{3,20}$/,
} as const
