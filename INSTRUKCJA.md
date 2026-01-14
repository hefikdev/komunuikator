# Instrukcja Instalacji Komunikatora

## Krok po kroku - Instalacja dla deweloperów

### 1. Przygotowanie środowiska

#### Wymagane oprogramowanie:
- **Node.js** wersja 18 lub nowsza
- **PostgreSQL** wersja 14 lub nowsza
- **npm** lub **yarn**
- **Git** (opcjonalnie)

### 2. Instalacja PostgreSQL

#### Windows:
1. Pobierz instalator z: https://www.postgresql.org/download/windows/
2. Uruchom instalator i postępuj zgodnie z instrukcjami
3. Zapamiętaj hasło superużytkownika postgres

#### macOS:
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. Utworzenie bazy danych

Zaloguj się do PostgreSQL:
```bash
psql -U postgres
```

Utwórz bazę danych:
```sql
CREATE DATABASE komunuikator;
CREATE USER komunuikator_user WITH PASSWORD 'twoje_haslo';
GRANT ALL PRIVILEGES ON DATABASE komunuikator TO komunuikator_user;
\q
```

### 4. Klonowanie projektu

```bash
git clone https://github.com/hefikdev/komunuikator.git
cd komunuikator
```

### 5. Instalacja zależności

```bash
npm install
```

### 6. Konfiguracja zmiennych środowiskowych

Skopiuj plik przykładowy:
```bash
cp .env.example .env
```

Edytuj plik `.env`:
```env
DATABASE_URL="postgresql://komunuikator_user:twoje_haslo@localhost:5432/komunuikator?schema=public"
JWT_SECRET="wygeneruj-bezpieczny-sekret-tutaj"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**WAŻNE:** Wygeneruj bezpieczny sekret dla JWT:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 7. Inicjalizacja bazy danych

#### Utworzenie tabel:
```bash
npm run db:push
```

#### Wypełnienie przykładowymi danymi (opcjonalne):
```bash
npm run db:seed
```

Po seedowaniu możesz zalogować się używając:
- **Login:** jan, **Hasło:** test123
- **Login:** anna, **Hasło:** test123
- **Login:** piotr, **Hasło:** test123

### 8. Uruchomienie aplikacji

#### Tryb deweloperski:
```bash
npm run dev
```

Aplikacja będzie dostępna pod: http://localhost:3000

#### Tryb produkcyjny:
```bash
npm run build
npm start
```

### 9. Weryfikacja instalacji

1. Otwórz przeglądarkę i przejdź do http://localhost:3000
2. Powinieneś zostać przekierowany na stronę logowania
3. Kliknij "Zarejestruj się" aby utworzyć nowe konto
4. Po rejestracji zostaniesz automatycznie zalogowany

## Rozwiązywanie problemów

### Problem: Nie można połączyć się z bazą danych

**Rozwiązanie:**
- Sprawdź czy PostgreSQL działa: `sudo systemctl status postgresql` (Linux) lub `brew services list` (macOS)
- Zweryfikuj dane w `.env`
- Sprawdź czy baza danych istnieje: `psql -U postgres -l`

### Problem: Błąd Prisma Client

**Rozwiązanie:**
```bash
npx prisma generate
npm run db:push
```

### Problem: Port 3000 jest zajęty

**Rozwiązanie:**
Zmień port w komendzie:
```bash
PORT=3001 npm run dev
```

### Problem: Błąd podczas instalacji zależności

**Rozwiązanie:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Deployment na produkcję

### Zmienne środowiskowe produkcyjne:

```env
DATABASE_URL="twój_url_produkcyjny"
JWT_SECRET="bezpieczny-losowy-ciąg-znaków-64+"
NEXT_PUBLIC_APP_URL="https://twoja-domena.com"
NODE_ENV="production"
```

### Serwery rekomendowane:
- **Vercel** (najlepiej zintegrowany z Next.js)
- **Railway** (łatwa konfiguracja z PostgreSQL)
- **Heroku** (z dodatkiem Postgres)
- **DigitalOcean App Platform**
- **AWS** (EC2 + RDS)

### Checklist przed wdrożeniem:

- [ ] Zmień `JWT_SECRET` na silny, losowy ciąg
- [ ] Skonfiguruj SSL/HTTPS
- [ ] Ustaw `NODE_ENV=production`
- [ ] Włącz kopie zapasowe bazy danych
- [ ] Skonfiguruj monitoring
- [ ] Ustaw limity rozmiaru plików
- [ ] Zweryfikuj zmienne środowiskowe
- [ ] Przeprowadź testy bezpieczeństwa

## Wsparcie

W razie problemów:
1. Sprawdź dokumentację: README.md
2. Przeczytaj logi błędów w terminalu
3. Otwórz issue na GitHubie: https://github.com/hefikdev/komunuikator/issues

## Aktualizacja projektu

```bash
git pull origin main
npm install
npx prisma generate
npm run db:push
npm run build
```
