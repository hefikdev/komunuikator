# Komunikator - Aplikacja Czatu w Czasie Rzeczywistym

## Opis projektu

Komunikator to nowoczesna aplikacja webowa do komunikacji w czasie rzeczywistym, zbudowana w Next.js 15 z TypeScript. Aplikacja umożliwia użytkownikom wymianę wiadomości w pokojach publicznych i prywatnych, przesyłanie plików oraz używanie emotikonów.

## Funkcjonalności

### ✅ Zrealizowane funkcjonalności:

- **System autentykacji**
  - Rejestracja nowych użytkowników
  - Logowanie z walidacją danych
  - Bezpieczne przechowywanie haseł (bcrypt)
  - JWT tokeny w HttpOnly cookies
  - Wylogowanie

- **Pokoje czatu**
  - Tworzenie pokoi publicznych i prywatnych
  - Automatyczne dołączanie do pokoi publicznych
  - Lista dostępnych pokoi
  - Przełączanie między pokojami

- **Wiadomości**
  - Wysyłanie i odbieranie wiadomości w czasie rzeczywistym (polling co 2 sekundy)
  - Sanityzacja treści wiadomości (ochrona przed XSS)
  - Historia ostatnich 100 wiadomości
  - Wyświetlanie nazwy użytkownika i czasu wysłania

- **Pliki**
  - Przesyłanie plików (obrazy, PDF, teksty, ZIP)
  - Walidacja typu i rozmiaru pliku (max 10MB)
  - Bezpieczne przechowywanie plików
  - Możliwość pobierania przesłanych plików

- **Emotikony**
  - Dodawanie emotikonów do wiadomości
  - Wygodny panel wyboru

- **Bezpieczeństwo**
  - Ochrona przed XSS (sanityzacja danych wejściowych)
  - Ochrona przed SQL Injection (Prisma ORM)
  - HttpOnly cookies (ochrona przed XSS na tokeny)
  - CSRF protection (SameSite cookies)
  - Walidacja danych wejściowych
  - Bezpieczne hashowanie haseł

- **UI/UX**
  - Estetyczny interfejs użytkownika
  - Komponenty shadcn/ui
  - Responsywny design
  - Gradient backgrounds
  - Intuicyjna nawigacja

## Technologie

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Baza danych**: PostgreSQL + Prisma ORM
- **Autentykacja**: JWT, bcrypt
- **Ikony**: Lucide React

## Struktura projektu

```
komunuikator/
├── app/
│   ├── api/
│   │   ├── auth/          # API autentykacji
│   │   ├── pokoje/        # API pokoi
│   │   ├── wiadomosci/    # API wiadomości
│   │   └── pliki/         # API przesyłania plików
│   ├── czat/              # Strona czatu
│   ├── logowanie/         # Strona logowania
│   ├── rejestracja/       # Strona rejestracji
│   ├── layout.tsx         # Layout główny
│   ├── page.tsx           # Strona główna (redirect)
│   └── globals.css        # Style globalne
├── components/
│   ├── ui/                # Komponenty shadcn/ui
│   └── czat/              # Komponenty czatu
├── lib/
│   ├── auth.ts            # Funkcje autentykacji i bezpieczeństwa
│   ├── prisma.ts          # Klient Prisma
│   └── utils.ts           # Funkcje pomocnicze
├── prisma/
│   └── schema.prisma      # Schemat bazy danych
└── public/
    └── uploads/           # Przesłane pliki
```

## Instalacja i uruchomienie

### Wymagania wstępne

- Node.js 18+ 
- PostgreSQL 14+
- npm lub yarn

### Kroki instalacji

1. **Klonowanie repozytorium**
```bash
git clone https://github.com/hefikdev/komunuikator.git
cd komunuikator
```

2. **Instalacja zależności**
```bash
npm install
```

3. **Konfiguracja bazy danych**

Utwórz plik `.env` w głównym katalogu:
```env
DATABASE_URL="postgresql://uzytkownik:haslo@localhost:5432/komunuikator?schema=public"
JWT_SECRET="twoj-bezpieczny-sekret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Migracja bazy danych**
```bash
npx prisma generate
npx prisma db push
```

5. **Uruchomienie aplikacji**
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## Użytkowanie

1. **Rejestracja**: Przejdź do `/rejestracja` i utwórz konto
2. **Logowanie**: Zaloguj się używając swojego loginu i hasła
3. **Czat**: Po zalogowaniu zobaczysz główny interfejs czatu
4. **Tworzenie pokoju**: Kliknij przycisk "+" przy liście pokoi
5. **Wysyłanie wiadomości**: Wybierz pokój i napisz wiadomość
6. **Przesyłanie plików**: Kliknij ikonę spinacza, wybierz plik
7. **Emotikony**: Kliknij ikonę buźki, wybierz emotikon

## Bezpieczeństwo

Aplikacja została zabezpieczona przed następującymi atakami:

- **XSS (Cross-Site Scripting)**: 
  - Sanityzacja wszystkich danych wejściowych
  - Używanie React (automatyczne escapowanie)
  - HttpOnly cookies dla tokenów JWT

- **SQL Injection**: 
  - Używanie Prisma ORM
  - Prepared statements

- **CSRF (Cross-Site Request Forgery)**: 
  - SameSite cookies
  - Weryfikacja tokenów JWT

- **Injection przez pliki**: 
  - Walidacja typu MIME
  - Ograniczenie rozmiaru pliku
  - Bezpieczne nazwy plików

## Rozwój

### Uruchomienie w trybie deweloperskim
```bash
npm run dev
```

### Build produkcyjny
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Autorzy

Projekt stworzony przez zespół - każdy członek ma swoje commity widoczne w historii Git.

## Licencja

ISC
