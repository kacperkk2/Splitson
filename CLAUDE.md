# CLAUDE.md

## Commands

```bash
ng serve        # dev server at http://localhost:4200
ng build        # production build → dist/splitson
ng test         # testy (ale nie są priorytetem)
```

## Architektura

Splitson to **bezserwerowa, jednostronicowa aplikacja Angular 16** do dzielenia wydatków. Brak backendu — całe dane żyją w `localStorage`, udostępnianie działa przez skompresowane parametry URL.

### Przepływ danych

- **Persystencja:** `StorageService` czyta/zapisuje users, records, name i currencyProfile do `localStorage`
- **Udostępnianie:** `DashboardComponent` → `CodecService` (własne kodowanie) → `lz-string` (kompresja LZ) → base64 URL param → opcjonalne skrócenie przez API `is.gd`
- **Ładowanie udostępnionych danych:** URL param → dekompresja → `CodecService` decode → `StorageService` → `DashboardComponent`

### Modele danych (zdefiniowane w `dashboard/dashboard.component.ts`)

```typescript
interface User { name: string; balance: number; }
interface Record { id: number; name: string; price: number; boughtBy: User[]; }
interface CurrencyProfile { paidCurrency: Currency; exchangeRate: number; targetCurrency: Currency; }
```

### Zarządzanie stanem

- **DashboardComponent** jest jedynym kontenerem stanu (`users`, `records`, `mainName`, `currencyProfile`)
- NgRx jest zaimportowany ale **nieużywany** — stan zarządzany bezpośrednio w komponencie
- Child components (`RecordsComponent`, `SummaryComponent`) dostają dane przez `@Input`
- Każda zmiana stanu → `storageService.storeAll()` lub `storeData()`

### Kluczowe pliki

| Plik | Rola |
|------|------|
| `src/app/dashboard/dashboard.component.ts` | Główny kontener stanu |
| `src/app/services/storage/storage.service.ts` | localStorage; łączy referencje records → users po deserializacji |
| `src/app/services/codec/codec.service.ts` | Kodowanie stanu do URL (`\|\|` i `\|@` jako separatory) |
| `src/app/services/id-manager/id-manager.service.ts` | Generowanie unikalnych ID rekordów |
| `src/app/services/short-url/short-url-service.service.ts` | Skracanie URL przez is.gd API |

### Struktura UI

- `RecordsComponent` — lista wydatków, używa `ExpenseTileComponent` i `BottomPanelComponent`
- `SummaryComponent` — podsumowanie sald, używa `BalanceTileComponent` i `BottomPanelComponent`
- Cała interakcja przez dialogi Material otwierane z `DashboardComponent`

### Komponenty kafelkowe (reusable)

| Komponent | Status | Uwagi |
|-----------|--------|-------|
| `ExpenseTileComponent` | Gotowy | Wyświetla wiersz wydatku |
| `BottomPanelComponent` | Gotowy | Dolny panel ze statystykami i przyciskiem FAB |
| `BalanceTileComponent` | **W trakcie pracy** | Saldo użytkownika z rozwijalną listą zakupów |

### Kodowanie Codec

Separatory: `||` (encje), `|@` (pola). Użytkownicy mapowani na indeksy numeryczne dla zwartości URL.

## Ważne wskazówki

- **Testy: nieistotne** — aplikacja prywatna, nie trzeba pisać/dbać o testy
- **Styl UI:** Kiedy odwzorowujesz wygląd z innej sekcji aplikacji, **zawsze czytaj style źródłowe** danego komponentu zamiast zgadywać — łatwo się tu pomylić przez mix Material + FlexLayout + customowych klas z `styles.scss`
- **Projekt prawie finalny** — zmiany dotyczą UI, nie logiki biznesowej; unikaj refaktoryzacji logiki, jeśli nie jest wyraźnie proszona
- **NgRx:** Zaimportowany, nieużywany — nie ruszaj, nie proponuj wdrożenia

### GitHub Pages deployment
Before every commit, ask the user whether they also want to build and deploy files for GitHub Pages. If yes, run these commands in order:

ng build --output-path docs --base-href /Splitson/
cp docs/index.html docs/404.html
Then include the updated docs/ in the commit.