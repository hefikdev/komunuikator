# Przewodnik dla Współtwórców

## Witamy w projekcie Komunikator!

Dziękujemy za zainteresowanie współpracą przy projekcie. Ten dokument zawiera wytyczne dla wszystkich członków zespołu.

## Jak zacząć?

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/hefikdev/komunuikator.git
cd komunuikator
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skonfiguruj środowisko**
```bash
cp .env.example .env
# Edytuj .env i ustaw dane połączenia z bazą
```

4. **Uruchom aplikację**
```bash
npm run dev
```

## Workflow Git

### Tworzenie brancha

Dla każdej nowej funkcji lub poprawki utwórz osobny branch:

```bash
git checkout -b feature/nazwa-funkcji
# lub
git checkout -b fix/nazwa-poprawki
```

**Konwencja nazewnictwa:**
- `feature/` - nowe funkcjonalności
- `fix/` - poprawki błędów
- `docs/` - zmiany w dokumentacji
- `refactor/` - refaktoryzacja kodu
- `test/` - dodawanie testów

### Commitowanie zmian

**Zasady commitów:**
1. Pisz commity po polsku
2. Używaj trybu rozkazującego ("Dodaj", nie "Dodano")
3. Commit powinien opisywać DLACZEGO, nie CO

**Przykłady dobrych commitów:**
```bash
git commit -m "Dodaj walidację formularza rejestracji"
git commit -m "Naprawa błędu wyświetlania emotikon"
git commit -m "Refaktoryzacja funkcji autentykacji"
git commit -m "Aktualizacja dokumentacji API"
```

**Przykłady złych commitów:**
```bash
git commit -m "fix"
git commit -m "zmiany"
git commit -m "update"
git commit -m "praca w toku"
```

### Push i Pull Request

1. **Wypchnij zmiany**
```bash
git push origin nazwa-brancha
```

2. **Utwórz Pull Request**
   - Przejdź na GitHub
   - Kliknij "New Pull Request"
   - Wybierz swój branch
   - Wypełnij opis zmian

3. **Opis PR powinien zawierać:**
   - Co zostało zmienione?
   - Dlaczego ta zmiana była potrzebna?
   - Jak przetestować zmiany?
   - Screenshoty (jeśli dotyczy UI)

## Konwencje kodu

### TypeScript/JavaScript

```typescript
// ✅ DOBRE - jasne nazwy zmiennych
const uzytkownik = await prisma.uzytkownik.findUnique({
  where: { id: uzytkownikId }
})

// ❌ ZŁE - niejasne skróty
const u = await prisma.uzytkownik.findUnique({
  where: { id: uId }
})
```

### Nazewnictwo

- **Zmienne i funkcje**: camelCase w języku polskim
  ```typescript
  const nazwaUzytkownika = "Jan"
  function pobierzWiadomosci() { }
  ```

- **Komponenty React**: PascalCase
  ```typescript
  export default function InterfejsCzatu() { }
  ```

- **Stałe**: UPPER_CASE
  ```typescript
  const MAX_ROZMIAR_PLIKU = 10 * 1024 * 1024
  ```

### Formatowanie

- Używaj **2 spacji** do wcięć (nie tabulatory)
- Zawsze dodawaj średniki
- Używaj pojedynczych cudzysłowów `'` dla stringów
- Maksymalna długość linii: 100 znaków

### Komentarze

```typescript
// ✅ DOBRE - opisuje DLACZEGO, nie CO
// Używamy bcrypt zamiast SHA256 dla lepszego bezpieczeństwa haseł
const hash = await bcrypt.hash(password, 10)

// ❌ ZŁE - opisuje oczywiste
// Hashuje hasło
const hash = await bcrypt.hash(password, 10)
```

## Struktura projektu

```
komunuikator/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Autentykacja
│   │   ├── pokoje/       # Zarządzanie pokojami
│   │   ├── wiadomosci/   # Wiadomości
│   │   └── pliki/        # Przesyłanie plików
│   ├── czat/              # Strona czatu
│   ├── logowanie/         # Strona logowania
│   └── rejestracja/       # Strona rejestracji
├── components/            # Komponenty React
│   ├── ui/               # Komponenty UI (shadcn)
│   └── czat/             # Komponenty czatu
├── lib/                   # Funkcje pomocnicze
│   ├── auth.ts           # Autentykacja
│   ├── prisma.ts         # Klient bazy danych
│   ├── utils.ts          # Narzędzia
│   └── constants.ts      # Stałe
└── prisma/               # Schemat bazy danych
    └── schema.prisma
```

## Testowanie

### Przed commitowaniem

1. **Sprawdź czy kod się kompiluje**
```bash
npm run build
```

2. **Uruchom linter (jeśli dostępny)**
```bash
npm run lint
```

3. **Przetestuj manualnie zmiany**
   - Uruchom aplikację lokalnie
   - Sprawdź czy wszystko działa poprawnie
   - Przetestuj edge cases

## Co NIE należy commitować?

- ❌ `node_modules/`
- ❌ `.env` (tylko `.env.example`)
- ❌ Pliki IDE (`.vscode/`, `.idea/`)
- ❌ Logi i pliki tymczasowe
- ❌ Hasła i klucze API
- ❌ Pliki przesłane przez użytkowników (`public/uploads/`)

## Checklist przed PR

- [ ] Kod się kompiluje bez błędów
- [ ] Zmiany są przetestowane lokalnie
- [ ] Commit messages są opisowe po polsku
- [ ] Nie commitowałem wrażliwych danych
- [ ] Zaktualizowałem dokumentację (jeśli potrzeba)
- [ ] Dodałem komentarze do skomplikowanego kodu
- [ ] Opis PR jest kompletny

## Rozwiązywanie konfliktów

Jeśli masz konflikty z main:

```bash
git checkout main
git pull origin main
git checkout twoj-branch
git merge main
# Rozwiąż konflikty w edytorze
git add .
git commit -m "Merge main do twoj-branch"
git push origin twoj-branch
```

## Pomoc i wsparcie

### Masz pytanie?

1. Sprawdź dokumentację: `README.md`, `INSTRUKCJA.md`
2. Przeczytaj istniejący kod - często znajdziesz podobny przykład
3. Zapytaj na czacie zespołu
4. Otwórz issue na GitHubie

### Znalazłeś błąd?

1. Sprawdź czy issue już nie istnieje
2. Utwórz nowy issue z opisem:
   - Co się stało?
   - Jakie były kroki?
   - Co powinno się stać?
   - Screenshoty (jeśli dotyczy)

## Przykładowy workflow

```bash
# 1. Pobierz najnowsze zmiany
git checkout main
git pull origin main

# 2. Utwórz nowy branch
git checkout -b feature/dodaj-reakcje-do-wiadomosci

# 3. Wprowadź zmiany
# ... edytuj pliki ...

# 4. Sprawdź status
git status

# 5. Dodaj pliki
git add .

# 6. Commit
git commit -m "Dodaj możliwość reagowania na wiadomości emotikonami"

# 7. Push
git push origin feature/dodaj-reakcje-do-wiadomosci

# 8. Utwórz Pull Request na GitHub
```

## Zasady code review

Gdy recenzujesz kod innych:

- ✅ Bądź konstruktywny i pomocny
- ✅ Zadawaj pytania, nie wydawaj poleceń
- ✅ Wskazuj konkretne problemy
- ✅ Doceniaj dobre rozwiązania
- ❌ Nie bądź krytyczny osobiście
- ❌ Nie narzucaj swojego stylu

## Cele projektu

Pamiętaj o celach projektu:
- 🎯 Prostota - kod ma być zrozumiały
- 🔒 Bezpieczeństwo - zawsze na pierwszym miejscu
- 🎨 Estetyka - UI ma być przyjemne w użyciu
- ⚡ Wydajność - aplikacja ma być szybka

## Dziękujemy!

Twoja praca ma znaczenie! Każdy commit to postęp dla całego zespołu. 🚀

---

**Pytania?** Otwórz issue lub skontaktuj się z zespołem!
