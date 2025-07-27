# Norsk Tidskonverter

En omfattende Chrome-utvidelse for å konvertere tid mellom forskjellige tidssoner med spesielt fokus på norske tidssoner (CET/CEST). Har et moderne design inspirert av det norske flagget og avansert nedtellingsfunksjonalitet.

## Funksjoner

### Tidskonvertering
- Konverter tid mellom hvilken som helst tidssone og norsk tid (CET/CEST)
- Støtte for store globale tidssoner inkludert UTC-forskyvninger
- Sanntidskonvertering med detaljert tidssone-informasjon
- Støtte for 12-timers og 24-timers tidsformat

### Brukergrensesnitt
- Moderne design inspirert av det norske flaggets farger (rød, hvit, blå)
- Flere visningsmodus: popup, flytende vindu og full fane
- Responsivt design som fungerer i alle vindustørrelser
- Rent, intuitivt grensesnitt med profesjonell styling

### Avansert Funksjonalitet
- Musehjul-støtte for rask tids- og datojustering (15-minutters intervaller)
- Nedtellingstimer med måneder, dager, timer og minutter visning
- Redigerbare nedtellingsbeskrivelser
- Tilstandslagring på tvers av økter
- Tastatursnarveier (Escape for å lukke flytende vinduer)

### Visningsmodus
1. **Popup-modus**: Kompakt utvidelse popup
2. **Flytende Vindu**: Løsnet, størrelsesjendrelig vindu
3. **Fane-modus**: Full nettleser fane-opplevelse

## Installasjon

1. Last ned eller klon dette repositoryet
2. Åpne Chrome og naviger til `chrome://extensions/`
3. Aktiver "Utviklermodus" øverst til høyre
4. Klikk "Last inn upakket" og velg prosjektmappen
5. Utvidelsen vil vises i Chrome-verktøylinjen din

## Bruk

### Grunnleggende Tidskonvertering
1. Klikk på utvidelsesikonet for å åpne konverteren
2. Velg kilde-tidssonen din fra rullegardinmenyen
3. Skriv inn datoen og tiden du vil konvertere
4. Resultatet vil automatisk vises i norsk tid (CET/CEST)
5. Bruk musehjulet på tids-/datoinnganger for raske justeringer

### Opprette Nedtellingstimere
1. Konverter en fremtidig tid
2. Klikk "Create Countdown" når den vises
3. Et nytt vindu åpnes med en live nedtelling
4. Klikk redigeringsknappen (blyant-ikon) for å legge til en egendefinert beskrivelse

### Vindusadministrasjon
- **Create Tab**: Åpner konverteren i en ny nettleserfane
- **Unpin Window**: Skaper et flytende, størrelsesjendrelig vindu
- **Escape-tasten**: Lukker flytende vinduer

### Musehjul Kontroller
- **Tidsingang**: Scroll for å justere i 15-minutters økninger
- **Datoingang**: Scroll for å endre dager
- Endringer utløser automatisk konverteringsoppdateringer

## Tekniske Detaljer

### Filstruktur
- `manifest.json`: Utvidelseskonfigurasjon
- `popup-calculator.html/js`: Hovedpopup-grensesnitt
- `tab-calculator.html/js`: Full fane-grensesnitt
- `countdown.html/js`: Nedtellingstimer-grensesnitt
- `background.js`: Utvidelse bakgrunnsskript

### Støttede Tidssoner
- Alle store globale tidssoner (PST, EST, JST, etc.)
- UTC-forskyvninger fra UTC-12 til UTC+12
- Automatisk sommertidshåndtering
- Spesiell fokus på norsk CET/CEST

### Nettleserkompatibilitet
- Chrome (primær støtte)
- Chromium-baserte nettlesere
- Krever Chrome Extensions API

## Designfilosofi

Utvidelsen bruker et design inspirert av det norske flagget:
- **Rød**: Primære handlinger og overskrifter
- **Blå**: Sekundære elementer og aksenter
- **Hvit**: Bakgrunn og kontrastelementer

Dette skaper en særskilt norsk estetikk samtidig som moderne brukbarhetsstandarder opprettholdes.

## Bidrag

Bidrag er velkommen! Vennligst send gjerne inn pull requests eller åpne issues for feil og funksjonsforespørsler.

## Lisens

Dette prosjektet er åpen kildekode og tilgjengelig under MIT-lisensen.

---

# Norwegian Time Converter

A comprehensive Chrome extension for converting time between different time zones with a special focus on Norwegian time zones (CET/CEST). Features a modern Norwegian flag-inspired design and advanced countdown functionality.

## Features

### Time Conversion
- Convert time between any time zone and Norwegian time (CET/CEST)
- Support for major global time zones including UTC offsets
- Real-time conversion with detailed timezone information
- 12-hour and 24-hour time format support

### User Interface
- Modern design inspired by the Norwegian flag colors (red, white, blue)
- Multiple display modes: popup, floating window, and full tab
- Responsive design that works in all window sizes
- Clean, intuitive interface with professional styling

### Advanced Functionality
- Mouse wheel support for quick time and date adjustment (15-minute intervals)
- Countdown timer with months, days, hours, and minutes display
- Editable countdown descriptions
- State persistence across sessions
- Keyboard shortcuts (Escape to close floating windows)

### Display Modes
1. **Popup Mode**: Compact extension popup
2. **Floating Window**: Unpinned resizable window
3. **Tab Mode**: Full browser tab experience

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project folder
5. The extension will appear in your Chrome toolbar

## Usage

### Basic Time Conversion
1. Click the extension icon to open the converter
2. Select your source timezone from the dropdown
3. Enter the date and time you want to convert
4. The result will automatically display in Norwegian time (CET/CEST)
5. Use the mouse wheel on time/date inputs for quick adjustments

### Creating Countdown Timers
1. Convert a future time
2. Click "Create Countdown" when it appears
3. A new window will open with a live countdown
4. Click the edit button (pencil icon) to add a custom description

### Window Management
- **Create Tab**: Opens the converter in a new browser tab
- **Unpin Window**: Creates a floating, resizable window
- **Escape Key**: Closes floating windows

### Mouse Wheel Controls
- **Time Input**: Scroll to adjust in 15-minute increments
- **Date Input**: Scroll to change days
- Changes automatically trigger conversion updates

## Technical Details

### Files Structure
- `manifest.json`: Extension configuration
- `popup-calculator.html/js`: Main popup interface
- `tab-calculator.html/js`: Full tab interface
- `countdown.html/js`: Countdown timer interface
- `background.js`: Extension background script

### Supported Time Zones
- All major global time zones (PST, EST, JST, etc.)
- UTC offsets from UTC-12 to UTC+12
- Automatic daylight saving time handling
- Special focus on Norwegian CET/CEST

### Browser Compatibility
- Chrome (primary support)
- Chromium-based browsers
- Requires Chrome Extensions API

## Design Philosophy

The extension uses a design inspired by the Norwegian flag:
- **Red**: Primary actions and headers
- **Blue**: Secondary elements and accents
- **White**: Background and contrast elements

This creates a distinctly Norwegian aesthetic while maintaining modern usability standards.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is open source and available under the MIT License.