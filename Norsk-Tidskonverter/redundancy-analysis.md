# Redundans-analyse for Norsk-Tidskonverter

## Filer som KAN fjernes (redundante):

### 1. content-auto.js (1022 linjer)
**ANBEFALING: FJERN DENNE FILEN**
- Denne filen inneholder automatisk tidssone-konvertering for nettsider
- Den er svært kompleks (1000+ linjer) og ikke nødvendig for hovedfunksjonaliteten
- Overlapper ikke med hovedapplikasjonen (popup/tab konverteren)
- Kan forårsake konflikter og overhead
- Hovedapp fungerer perfekt uten denne

## Kodeblokker som kan optimaliseres:

### 2. popup-calculator.js & tab-calculator.js
**Duplikat funksjonalitet som kan reduseres:**
- `addMouseWheelSupport()` er identisk i begge filer (74 linjer hver)
- `convertTimeToNorwegian()` logikk er duplisert
- Mange fellesfunksjoner kan abstraheres til en felles fil

### 3. Timezone mappings
- Store timezone objekter er dupliserte mellom filene
- Kan flyttes til en felles konfigurasjonsfil

## CSS redundans:
- Begge HTML-filer har mye identisk CSS
- Tab-mode CSS overskriver mye av popup CSS

## Anbefalte endringer:

### Høy prioritet:
1. **FJERN content-auto.js** - Sparer 1022 linjer og reduserer kompleksitet
2. **Oppdater manifest.json** - Fjern content_scripts seksjon

### Middels prioritet:
3. Lag en felles `utils.js` for delte funksjoner
4. Lag en felles `timezones.js` for timezone mappings
5. Optimaliser CSS med delte klasser

### Forventet reduksjon:
- **Umiddelbart**: -1022 linjer (content-auto.js)
- **Med optimalisering**: -300-400 linjer til
- **Total**: ~30-35% mindre kodebase