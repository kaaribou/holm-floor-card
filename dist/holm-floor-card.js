/* holm-floor-card — https://github.com/kaaribou/holm-floor-card — licence MIT — v1.2.0 */
/* HOLM Floor Card — v1
 * Températures & humidité d'un étage, pièce par pièce.
 * - En-tête : moyenne de l'étage, humidité moyenne, écart, température dehors
 * - Bande thermique : chaque pièce placée sur une échelle de couleurs
 * - Tuiles pièces : température colorée, tendance sur 1 h, humidité,
 *   mini-courbe 24 h (statistiques natives du recorder)
 * - Toucher une pièce : graphique détaillé 24 h / 7 j (temp + humidité,
 *   min / moy / max) ; appui long : fiche de l'entité
 */
(() => {
  // ---- HOLM i18n : textes écrits en français, traduits à l'affichage (en, de, es, it, nl, pt, pl) ----
  // Langue : option `language` de la carte, sinon celle du profil Home Assistant ; anglais si la langue n'est pas traduite.
  const HOLM_LANGS = ["en", "de", "es", "it", "nl", "pt", "pl"];
  const LANG_NAMES = { fr: "Français", en: "English", de: "Deutsch", es: "Español", it: "Italiano", nl: "Nederlands", pt: "Português", pl: "Polski" };
  const LOCALES = { fr: "fr-FR", en: "en-GB", de: "de-DE", es: "es-ES", it: "it-IT", nl: "nl-NL", pt: "pt-PT", pl: "pl-PL" };
  const I18N = {
    "Automatique (profil)": ["Automatic (profile)", "Automatisch (Profil)", "Automático (perfil)", "Automatica (profilo)", "Automatisch (profiel)", "Automático (perfil)", "Automatycznie (profil)"],
    "Langue": ["Language", "Sprache", "Idioma", "Lingua", "Taal", "Idioma", "Język"],
    "Titre": ["Title", "Titel", "Título", "Titolo", "Titel", "Título", "Tytuł"],
    "Titre (optionnel)": ["Title (optional)", "Titel (optional)", "Título (opcional)", "Titolo (facoltativo)", "Titel (optioneel)", "Título (opcional)", "Tytuł (opcjonalnie)"],
    "Nom": ["Name", "Name", "Nombre", "Nome", "Naam", "Nome", "Nazwa"],
    "Nom affiché": ["Display name", "Anzeigename", "Nombre mostrado", "Nome visualizzato", "Weergavenaam", "Nome apresentado", "Wyświetlana nazwa"],
    "Icône": ["Icon", "Symbol", "Icono", "Icona", "Pictogram", "Ícone", "Ikona"],
    "Couleur": ["Colour", "Farbe", "Color", "Colore", "Kleur", "Cor", "Kolor"],
    "Couleurs": ["Colours", "Farben", "Colores", "Colori", "Kleuren", "Cores", "Kolory"],
    "Entité": ["Entity", "Entität", "Entidad", "Entità", "Entiteit", "Entidade", "Encja"],
    "Entités": ["Entities", "Entitäten", "Entidades", "Entità", "Entiteiten", "Entidades", "Encje"],
    "Chargement…": ["Loading…", "Wird geladen…", "Cargando…", "Caricamento…", "Laden…", "A carregar…", "Ładowanie…"],
    "Erreur": ["Error", "Fehler", "Error", "Errore", "Fout", "Erro", "Błąd"],
    "Fermer": ["Close", "Schließen", "Cerrar", "Chiudi", "Sluiten", "Fechar", "Zamknij"],
    "Annuler": ["Cancel", "Abbrechen", "Cancelar", "Annulla", "Annuleren", "Cancelar", "Anuluj"],
    "Enregistrer": ["Save", "Speichern", "Guardar", "Salva", "Opslaan", "Guardar", "Zapisz"],
    "Supprimer": ["Delete", "Löschen", "Eliminar", "Elimina", "Verwijderen", "Eliminar", "Usuń"],
    "Ajouter": ["Add", "Hinzufügen", "Añadir", "Aggiungi", "Toevoegen", "Adicionar", "Dodaj"],
    "Monter": ["Move up", "Nach oben", "Subir", "Sposta su", "Omhoog", "Mover para cima", "W górę"],
    "Descendre": ["Move down", "Nach unten", "Bajar", "Sposta giù", "Omlaag", "Mover para baixo", "W dół"],
    "Afficher le cadre de la carte": ["Show the card frame", "Kartenrahmen anzeigen", "Mostrar el marco de la tarjeta", "Mostra la cornice della scheda", "Kaartkader tonen", "Mostrar a moldura do cartão", "Pokaż ramkę karty"],
    "Indisponible": ["Unavailable", "Nicht verfügbar", "No disponible", "Non disponibile", "Niet beschikbaar", "Indisponível", "Niedostępne"],
    "Aujourd'hui": ["Today", "Heute", "Hoy", "Oggi", "Vandaag", "Hoje", "Dziś"],
    "Hier": ["Yesterday", "Gestern", "Ayer", "Ieri", "Gisteren", "Ontem", "Wczoraj"],
    "Demain": ["Tomorrow", "Morgen", "Mañana", "Domani", "Morgen", "Amanhã", "Jutro"],
    "Batterie": ["Battery", "Batterie", "Batería", "Batteria", "Batterij", "Bateria", "Bateria"],
    "Aucune donnée sur cette période.": ["No data for this period.", "Keine Daten für diesen Zeitraum.", "No hay datos en este periodo.", "Nessun dato per questo periodo.", "Geen gegevens voor deze periode.", "Sem dados neste período.", "Brak danych w tym okresie."],
    "à l'instant": ["just now", "gerade eben", "ahora mismo", "proprio ora", "zojuist", "agora mesmo", "przed chwilą"],
    "il y a {n} min": ["{n} min ago", "vor {n} Min.", "hace {n} min", "{n} min fa", "{n} min geleden", "há {n} min", "{n} min temu"],
    "il y a {n} h": ["{n} h ago", "vor {n} Std.", "hace {n} h", "{n} h fa", "{n} u geleden", "há {n} h", "{n} godz. temu"],
    "il y a {n} j": ["{n} d ago", "vor {n} T.", "hace {n} d", "{n} g fa", "{n} d geleden", "há {n} d", "{n} dni temu"],
    "Sec": ["Dry", "Trocken", "Seco", "Secco", "Droog", "Seco", "Sucho"],
    "Idéal": ["Ideal", "Ideal", "Ideal", "Ideale", "Ideaal", "Ideal", "Idealnie"],
    "Humide": ["Humid", "Feucht", "Húmedo", "Umido", "Vochtig", "Húmido", "Wilgotno"],
    "Très humide": ["Very humid", "Sehr feucht", "Muy húmedo", "Molto umido", "Erg vochtig", "Muito húmido", "Bardzo wilgotno"],
    "Rez-de-chaussée": ["Ground floor", "Erdgeschoss", "Planta baja", "Piano terra", "Begane grond", "Rés-do-chão", "Parter"],
    "Ajoute au moins une pièce.": ["Add at least one room.", "Füge mindestens einen Raum hinzu.", "Añade al menos una habitación.", "Aggiungi almeno una stanza.", "Voeg minstens één ruimte toe.", "Adicione pelo menos uma divisão.", "Dodaj co najmniej jedno pomieszczenie."],
    "Étage": ["Floor", "Etage", "Planta", "Piano", "Verdieping", "Piso", "Piętro"],
    "{n} pièce": ["{n} room", "{n} Raum", "{n} habitación", "{n} stanza", "{n} ruimte", "{n} divisão", "{n} pomieszczenie"],
    "{n} pièces": ["{n} rooms", "{n} Räume", "{n} habitaciones", "{n} stanze", "{n} ruimtes", "{n} divisões", "pomieszczenia: {n}"],
    "écart {x}°": ["spread {x}°", "Spanne {x}°", "diferencia {x}°", "scarto {x}°", "verschil {x}°", "diferença {x}°", "różnica {x}°"],
    "dehors {x}°": ["outside {x}°", "draußen {x}°", "fuera {x}°", "fuori {x}°", "buiten {x}°", "fora {x}°", "na zewnątrz {x}°"],
    "moyenne": ["average", "Mittel", "media", "media", "gemiddeld", "média", "średnio"],
    "dehors": ["outside", "draußen", "fuera", "fuori", "buiten", "fora", "na zewnątrz"],
    "Batterie {p} %": ["Battery {p}%", "Batterie {p} %", "Batería {p} %", "Batteria {p}%", "Batterij {p}%", "Bateria {p}%", "Bateria {p}%"],
    "Batterie faible": ["Low battery", "Batterie schwach", "Batería baja", "Batteria scarica", "Batterij bijna leeg", "Bateria fraca", "Słaba bateria"],
    "Historique en cours de chargement…": ["Loading history…", "Verlauf wird geladen…", "Cargando historial…", "Caricamento cronologia…", "Geschiedenis laden…", "A carregar histórico…", "Ładowanie historii…"],
    "7 j": ["7 d", "7 T", "7 d", "7 g", "7 d", "7 d", "7 d"],
    "Température": ["Temperature", "Temperatur", "Temperatura", "Temperatura", "Temperatuur", "Temperatura", "Temperatura"],
    "Humidité": ["Humidity", "Luftfeuchtigkeit", "Humedad", "Umidità", "Luchtvochtigheid", "Humidade", "Wilgotność"],
    "min {a} · moy {b} · max {c}": ["min {a} · avg {b} · max {c}", "min {a} · Ø {b} · max {c}", "mín {a} · media {b} · máx {c}", "min {a} · media {b} · max {c}", "min {a} · gem {b} · max {c}", "mín {a} · média {b} · máx {c}", "min {a} · śr. {b} · maks {c}"],
    "Nom de l'étage": ["Floor name", "Name der Etage", "Nombre de la planta", "Nome del piano", "Naam van de verdieping", "Nome do piso", "Nazwa piętra"],
    "Température extérieure (option)": ["Outdoor temperature (optional)", "Außentemperatur (optional)", "Temperatura exterior (opcional)", "Temperatura esterna (facoltativa)", "Buitentemperatuur (optioneel)", "Temperatura exterior (opcional)", "Temperatura zewnętrzna (opcjonalnie)"],
    "Heures sur les mini-courbes": ["Hours on the mini charts", "Stunden in den Mini-Kurven", "Horas en las mini curvas", "Ore sulle mini curve", "Uren in de minigrafieken", "Horas nas mini curvas", "Godziny na mini wykresach"],
    "Afficher l'humidité": ["Show humidity", "Luftfeuchtigkeit anzeigen", "Mostrar la humedad", "Mostra l'umidità", "Luchtvochtigheid tonen", "Mostrar a humidade", "Pokaż wilgotność"],
    "Apparence": ["Appearance", "Erscheinungsbild", "Apariencia", "Aspetto", "Uiterlijk", "Aparência", "Wygląd"],
    "Badge batterie": ["Battery badge", "Batterie-Badge", "Indicador de batería", "Badge batteria", "Batterijbadge", "Indicador de bateria", "Plakietka baterii"],
    "Afficher le pourcentage": ["Show the percentage", "Prozentsatz anzeigen", "Mostrar el porcentaje", "Mostra la percentuale", "Percentage tonen", "Mostrar a percentagem", "Pokaż procent"],
    "Seuil orange (%)": ["Orange threshold (%)", "Orange Schwelle (%)", "Umbral naranja (%)", "Soglia arancione (%)", "Oranje drempel (%)", "Limite laranja (%)", "Próg pomarańczowy (%)"],
    "Seuil rouge (%)": ["Red threshold (%)", "Rote Schwelle (%)", "Umbral rojo (%)", "Soglia rossa (%)", "Rode drempel (%)", "Limite vermelho (%)", "Próg czerwony (%)"],
    "Pièce": ["Room", "Raum", "Habitación", "Stanza", "Ruimte", "Divisão", "Pomieszczenie"],
    "Nom court (bande)": ["Short name (strip)", "Kurzname (Leiste)", "Nombre corto (banda)", "Nome breve (barra)", "Korte naam (balk)", "Nome curto (faixa)", "Krótka nazwa (pasek)"],
    "Capteur de température": ["Temperature sensor", "Temperatursensor", "Sensor de temperatura", "Sensore di temperatura", "Temperatuursensor", "Sensor de temperatura", "Czujnik temperatury"],
    "Capteur d'humidité (option)": ["Humidity sensor (optional)", "Feuchtigkeitssensor (optional)", "Sensor de humedad (opcional)", "Sensore di umidità (facoltativo)", "Vochtigheidssensor (optioneel)", "Sensor de humidade (opcional)", "Czujnik wilgotności (opcjonalnie)"],
    "Batterie de la sonde (option)": ["Sensor battery (optional)", "Batterie des Fühlers (optional)", "Batería de la sonda (opcional)", "Batteria della sonda (facoltativa)", "Batterij van de sensor (optioneel)", "Bateria da sonda (opcional)", "Bateria czujnika (opcjonalnie)"],
    "Pour les pièces qui ont un capteur de batterie": ["For rooms with a battery sensor", "Für Räume mit Batteriesensor", "Para las habitaciones con sensor de batería", "Per le stanze con un sensore di batteria", "Voor ruimtes met een batterijsensor", "Para as divisões com sensor de bateria", "Dla pomieszczeń z czujnikiem baterii"],
    "Si la sonde ne remonte qu’un état « batterie faible », seule l’icône s’affiche": ["If the sensor only reports a “low battery” state, only the icon is shown", "Meldet der Fühler nur „Batterie schwach“, wird nur das Symbol angezeigt", "Si la sonda solo indica «batería baja», solo se muestra el icono", "Se la sonda segnala solo «batteria scarica», viene mostrata solo l'icona", "Als de sensor alleen ‘batterij bijna leeg’ meldt, wordt alleen het pictogram getoond", "Se a sonda só indicar «bateria fraca», apenas o ícone é mostrado", "Jeśli czujnik zgłasza tylko „słaba bateria”, wyświetlana jest tylko ikona"],
    "Automatique (suit le mode clair / sombre)": ["Automatic (follows light / dark mode)", "Automatisch (folgt hell / dunkel)", "Automático (sigue el modo claro / oscuro)", "Automatico (segue la modalità chiara / scura)", "Automatisch (volgt licht / donker)", "Automático (segue o modo claro / escuro)", "Automatycznie (jasny / ciemny tryb)"],
    "Sombre": ["Dark", "Dunkel", "Oscuro", "Scuro", "Donker", "Escuro", "Ciemny"],
    "Clair": ["Light", "Hell", "Claro", "Chiaro", "Licht", "Claro", "Jasny"],
    "Couleurs de mon thème Home Assistant": ["My Home Assistant theme colours", "Farben meines Home-Assistant-Themes", "Colores de mi tema de Home Assistant", "Colori del mio tema Home Assistant", "Kleuren van mijn Home Assistant-thema", "Cores do meu tema do Home Assistant", "Kolory mojego motywu Home Assistant"],
    "Toujours": ["Always", "Immer", "Siempre", "Sempre", "Altijd", "Sempre", "Zawsze"],
    "Seulement si faible": ["Only when low", "Nur wenn schwach", "Solo si está baja", "Solo se scarica", "Alleen als bijna leeg", "Só se fraca", "Tylko gdy słaba"],
    "Jamais": ["Never", "Nie", "Nunca", "Mai", "Nooit", "Nunca", "Nigdy"],
    "Pièces": ["Rooms", "Räume", "Habitaciones", "Stanze", "Ruimtes", "Divisões", "Pomieszczenia"],
    "Pièce {n}": ["Room {n}", "Raum {n}", "Habitación {n}", "Stanza {n}", "Ruimte {n}", "Divisão {n}", "Pomieszczenie {n}"],
    "+ Ajouter une pièce": ["+ Add a room", "+ Raum hinzufügen", "+ Añadir una habitación", "+ Aggiungi una stanza", "+ Ruimte toevoegen", "+ Adicionar uma divisão", "+ Dodaj pomieszczenie"],
    "Nouvelle pièce": ["New room", "Neuer Raum", "Nueva habitación", "Nuova stanza", "Nieuwe ruimte", "Nova divisão", "Nowe pomieszczenie"],
    "HOLM Étage": ["HOLM Floor", "HOLM Etage", "HOLM Planta", "HOLM Piano", "HOLM Verdieping", "HOLM Piso", "HOLM Piętro"],
    "Températures et humidité d'un étage : bande thermique, tuiles pièces avec tendance et courbes.": ["Temperatures and humidity of a floor: heat strip, room tiles with trends and charts.", "Temperaturen und Feuchtigkeit einer Etage: Wärmeleiste, Raumkacheln mit Trend und Kurven.", "Temperaturas y humedad de una planta: banda térmica, mosaicos de habitaciones con tendencia y curvas.", "Temperature e umidità di un piano: barra termica, riquadri delle stanze con tendenza e curve.", "Temperaturen en vochtigheid van een verdieping: warmtebalk, ruimtetegels met trend en grafieken.", "Temperaturas e humidade de um piso: faixa térmica, mosaicos de divisões com tendência e curvas.", "Temperatura i wilgotność piętra: pasek termiczny, kafelki pomieszczeń z trendem i wykresami."]
  };
  let LANG = "fr", NUMLOC = "fr-FR";
  const langOf = (hass, c) => { const l = String((c && c.language) || (hass && ((hass.locale && hass.locale.language) || hass.language)) || navigator.language || "en").toLowerCase().split(/[-_]/)[0]; return l === "fr" || HOLM_LANGS.includes(l) ? l : "en"; };
  const setLang = (hass, c) => { LANG = langOf(hass, c); const p = hass && hass.locale && hass.locale.language; NUMLOC = !(c && c.language) && p && p.toLowerCase().startsWith(LANG) ? p : LOCALES[LANG]; return LANG; };
  const _ = (s, v) => { let o = LANG === "fr" ? s : ((I18N[s] && I18N[s][HOLM_LANGS.indexOf(LANG)]) || s); if (v) for (const k in v) o = o.split("{" + k + "}").join(v[k]); return o; };
  // champ « Langue » pour les éditeurs visuels (ha-form)
  const langField = () => ({ name: "language", selector: { select: { mode: "dropdown", options: [{ value: "", label: _("Automatique (profil)") }, ...Object.entries(LANG_NAMES).map(([value, label]) => ({ value, label }))] } } });
  // traduit les titres de sections et les libellés d'options d'un schéma ha-form (écrits en français)
  const locSchema = (sc) => (sc || []).map((x) => { const o = { ...x }; if (o.title) o.title = _(o.title); if (o.schema) o.schema = locSchema(o.schema);
    if (o.selector && o.selector.select && o.name !== "language") o.selector = { ...o.selector, select: { ...o.selector.select, options: (o.selector.select.options || []).map((op) => (typeof op === "string" ? op : { ...op, label: _(op.label) })) } };
    if (o.name === "language" && o.selector && o.selector.select) o.selector = { ...o.selector, select: { ...o.selector.select, options: o.selector.select.options.map((op) => (op.value ? op : { ...op, label: _("Automatique (profil)") })) } };
    return o; });
  const STOPS = [[-5, [129, 140, 248]], [5, [96, 165, 250]], [12, [56, 189, 248]], [17, [45, 212, 191]], [20, [74, 222, 128]], [23, [250, 204, 21]], [25.5, [251, 146, 60]], [28, [239, 68, 68]], [35, [220, 38, 38]]];
  const tRGB = (t) => {
    if (t == null || isNaN(t)) return [148, 163, 184];
    if (t <= STOPS[0][0]) return STOPS[0][1];
    for (let i = 1; i < STOPS.length; i++) {
      if (t <= STOPS[i][0]) {
        const [a, ca] = STOPS[i - 1], [b, cb] = STOPS[i];
        const k = (t - a) / (b - a);
        return ca.map((v, j) => Math.round(v + (cb[j] - v) * k));
      }
    }
    return STOPS[STOPS.length - 1][1];
  };
  const rgb = (a) => a.join(",");
  const hum = (h) => (h == null ? null : h < 35 ? { c: "251,191,36", t: _("Sec") } : h <= 60 ? { c: "45,212,191", t: _("Idéal") } : h <= 70 ? { c: "56,189,248", t: _("Humide") } : { c: "96,165,250", t: _("Très humide") });
  const fmt = (v, d = 1) => (v == null || isNaN(v) ? "–" : Number(v).toLocaleString(NUMLOC, { minimumFractionDigits: d, maximumFractionDigits: d }));
  const num = (s) => (s && !isNaN(parseFloat(s.state)) ? parseFloat(s.state) : null);
  const avg = (a) => { const v = a.filter((x) => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };

  // badge batterie : icône et couleur selon le niveau et les seuils de la carte
  const battery = (st, warn, low) => {
    if (!st || st.state === "unavailable" || st.state === "unknown") return { icon: "mdi:battery-unknown", c: "148,163,184", pct: null, low: false };
    if (st.entity_id.startsWith("binary_sensor.")) {
      const isLow = st.state === "on";
      return { icon: isLow ? "mdi:battery-alert-variant-outline" : "mdi:battery", c: isLow ? "239,68,68" : "74,222,128", pct: null, low: isLow };
    }
    const v = parseFloat(st.state);
    if (isNaN(v)) return { icon: "mdi:battery-unknown", c: "148,163,184", pct: null, low: false };
    const icon = v > 90 ? "mdi:battery" : v > 60 ? "mdi:battery-80" : v > 30 ? "mdi:battery-50" : v > 20 ? "mdi:battery-30" : v > 10 ? "mdi:battery-alert-variant-outline" : "mdi:battery-alert";
    const c = v < low ? "239,68,68" : v < warn ? "251,191,36" : "74,222,128";
    return { icon, c, pct: Math.round(v), low: v < warn };
  };

  const spark = (pts, w, h, pad = 2) => {
    const v = pts.filter((p) => p.v != null);
    if (v.length < 2) return "";
    const t0 = v[0].t, t1 = v[v.length - 1].t;
    let lo = Math.min(...v.map((p) => p.v)), hi = Math.max(...v.map((p) => p.v));
    if (hi - lo < 1) { const m = (hi + lo) / 2; lo = m - 0.5; hi = m + 0.5; }
    const X = (t) => pad + ((t - t0) / (t1 - t0 || 1)) * (w - 2 * pad);
    const Y = (y) => h - pad - ((y - lo) / (hi - lo)) * (h - 2 * pad);
    let d = `M${X(v[0].t).toFixed(1)},${Y(v[0].v).toFixed(1)}`;
    for (let i = 1; i < v.length; i++) {
      const x0 = X(v[i - 1].t), y0 = Y(v[i - 1].v), x1 = X(v[i].t), y1 = Y(v[i].v), cx = (x0 + x1) / 2;
      d += ` C${cx.toFixed(1)},${y0.toFixed(1)} ${cx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    return { line: d, area: `${d} L${X(t1).toFixed(1)},${h} L${X(t0).toFixed(1)},${h} Z`, lx: X(t1), ly: Y(v[v.length - 1].v) };
  };

  class HolmFloorCard extends HTMLElement {
    static getConfigElement() {
      return document.createElement("holm-floor-card-editor");
    }
    static getStubConfig(hass) {
      const t = hass ? Object.keys(hass.states).filter((k) => k.startsWith("sensor.") && hass.states[k].attributes.device_class === "temperature").slice(0, 3) : [];
      setLang(hass); return { type: "custom:holm-floor-card", title: _("Rez-de-chaussée"), icon: "mdi:home-floor-0", rooms: t.map((e) => ({ name: hass.states[e].attributes.friendly_name || e, temperature: e })) };
    }
    setConfig(config) {
      if (!config || !Array.isArray(config.rooms) || !config.rooms.length) throw new Error(_("Ajoute au moins une pièce."));
      this._config = { icon: "mdi:home-floor-0", hours: 24, show_humidity: true, theme: "auto", battery_display: "always", battery_percent: false, battery_warn: 30, battery_low: 15, ...config };
      this._stats = {};
      this._statsTs = 0;
      this._sel = null;
      this._period = "24h";
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      this._built = false;
      if (this._hass) this.hass = this._hass;
    }
    getCardSize() {
      return 2 + Math.ceil(this._config.rooms.length / 2) * 2;
    }
    getGridOptions() {
      return { columns: 12, min_columns: 6, rows: "auto" };
    }
    set hass(hass) {
      this._hass = hass;
      if (!this._config) return;
      this._tone();
      if (setLang(hass, this._config) !== this._lang) { this._lang = LANG; this._built = false; }
      if (!this._built) this._build();
      this._render();
      this._fetch(false);
    }
    connectedCallback() {
      if (this._hass && this._built) this._fetch(true);
    }

    // Apparence : auto (suit le fond réellement appliqué par le thème), sombre, clair ou couleurs du thème
    // batterie : si l'entité choisie ne donne pas de pourcentage (capteur « batterie faible » ou % indisponible),
    // on cherche un autre capteur de batterie sur le même appareil pour récupérer le niveau
    _battery(h, id) {
      const warn = Number(this._config.battery_warn) || 30, low = Number(this._config.battery_low) || 15;
      const st = h.states[id];
      let b = battery(st, warn, low);
      if (b.pct != null || !h.entities) return b;
      const dev = h.entities[id] && h.entities[id].device_id;
      if (!dev) return b;
      const sib = Object.values(h.entities).map((e) => e.device_id === dev && e.entity_id !== id ? h.states[e.entity_id] : null)
        .filter((x) => x && x.attributes.device_class === "battery" && x.state !== "unknown" && x.state !== "unavailable");
      const pctSt = sib.find((x) => x.entity_id.startsWith("sensor.") && !isNaN(parseFloat(x.state)));
      const lowSt = id.startsWith("binary_sensor.") ? st : sib.find((x) => x.entity_id.startsWith("binary_sensor."));
      if (pctSt) {
        b = battery(pctSt, warn, low);
        if (lowSt && lowSt.state === "on") b = { ...b, c: "239,68,68", low: true };
      } else if (lowSt && b.icon === "mdi:battery-unknown") b = battery(lowSt, warn, low);
      return b;
    }
    _tone() {
      const t = this._config.theme || "auto";
      let dark = !!(this._hass && this._hass.themes && this._hass.themes.darkMode);
      try {
        const cs = getComputedStyle(this);
        const bg = (cs.getPropertyValue("--primary-background-color") || cs.getPropertyValue("--card-background-color") || "").trim();
        const m = bg.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i) || bg.match(/rgba?\(([^)]+)\)/i);
        if (m) {
          let c;
          if (bg.startsWith("#")) { const h = m[1].length === 3 ? m[1].replace(/./g, "$&$&") : m[1]; c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
          else c = m[1].split(",").slice(0, 3).map((x) => parseFloat(x));
          if (c.every((x) => !isNaN(x))) dark = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255 < 0.5;
        }
      } catch (e) { /* on garde darkMode */ }
      const tone = t === "auto" ? (dark ? "dark" : "light") : t;
      if (this.dataset.tone !== tone) this.dataset.tone = tone;
    }
    _ids() {
      const ids = [];
      this._config.rooms.forEach((r) => { if (r.temperature) ids.push(r.temperature); if (r.humidity) ids.push(r.humidity); });
      return ids;
    }
    async _fetch(force, period) {
      if (!this._hass || !this._hass.callWS) return;
      if (!force && Date.now() - this._statsTs < 600000) return;
      this._statsTs = Date.now();
      const hrs = period === "7j" ? 168 : Number(this._config.hours) || 24;
      const start = new Date(Date.now() - hrs * 3600000).toISOString();
      try {
        const r = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: start, statistic_ids: this._ids(), period: period === "7j" ? "hour" : hrs <= 48 ? "5minute" : "hour", types: ["mean", "min", "max"], units: {} });
        const out = {};
        Object.entries(r || {}).forEach(([id, rows]) => {
          out[id] = rows.map((x) => ({ t: typeof x.start === "number" ? x.start : new Date(x.start).getTime(), v: x.mean, lo: x.min, hi: x.max }));
        });
        if (period === "7j") this._stats7 = out;
        else this._stats = out;
        this._sparkKey = null;
        this._render();
      } catch (e) { /* recorder indisponible */ }
    }

    _build() {
      const root = this.shadowRoot;
      root.innerHTML = `<style>${HolmFloorCard.css()}</style>
        <ha-card>
          <div class="amb"></div>
          <div class="wrap">
            <div class="head">
              <div class="fi"><ha-icon id="ficon"></ha-icon></div>
              <div class="ft"><div class="title" id="title"></div><div class="sub" id="sub"></div></div>
              <div class="avg" id="avg"></div>
            </div>
            <div class="strip" id="strip"><div class="bar" id="bar"></div><div class="dots" id="dots"></div><div class="scale" id="scale"></div></div>
            <div class="rooms" id="rooms"></div>
            <div class="detail" id="detail"></div>
          </div>
        </ha-card>`;
      this.$ = (id) => root.getElementById(id);
      this._built = true;
    }

    _roomData() {
      const h = this._hass;
      return this._config.rooms.map((r, i) => {
        const ts = h.states[r.temperature], hs = r.humidity ? h.states[r.humidity] : null;
        const t = num(ts), hu = num(hs);
        const pts = this._stats[r.temperature] || [];
        const ago = Date.now() - 3600000;
        const past = pts.filter((p) => p.t <= ago && p.v != null).pop();
        const trend = past && t != null ? t - past.v : null;
        const bat = r.battery ? this._battery(h, r.battery) : null;
        return { i, r, t, hu, trend, pts, bat, unav: !ts || ts.state === "unavailable" };
      });
    }

    _render() {
      const $ = this.$;
      const cfg = this._config;
      const rooms = this._roomData();
      const temps = rooms.map((x) => x.t).filter((x) => x != null);
      const a = avg(temps), ah = avg(rooms.map((x) => x.hu));
      const lo = temps.length ? Math.min(...temps) : null, hi = temps.length ? Math.max(...temps) : null;
      const card = this.shadowRoot.querySelector("ha-card");
      card.style.setProperty("--f", rgb(tRGB(a)));
      $("ficon").setAttribute("icon", cfg.icon);
      $("title").textContent = cfg.title === undefined ? _("Étage") : _(cfg.title);
      const out = cfg.outdoor_entity ? num(this._hass.states[cfg.outdoor_entity]) : null;
      const parts = [_(rooms.length > 1 ? _("{n} pièces") : _("{n} pièce"), { n: rooms.length })];
      if (ah != null && cfg.show_humidity) parts.push(`<span class="hdrop"><ha-icon icon="mdi:water-percent"></ha-icon>${fmt(ah, 0)} %</span>`);
      if (lo != null && hi - lo >= 0.1) parts.push(_("écart {x}°", { x: fmt(hi - lo) }));
      if (out != null) parts.push(`<span class="out"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${_("dehors {x}°", { x: fmt(out) })}</span>`);
      $("sub").innerHTML = parts.join(" · ");
      $("avg").innerHTML = a == null ? "" : `<b>${fmt(a)}</b><sup>°</sup><small>${_("moyenne")}</small>`;

      // bande thermique
      const smin = Math.floor(Math.min(lo ?? 18, (a ?? 20) - 3, out ?? 99) - 1);
      const smax = Math.ceil(Math.max(hi ?? 24, (a ?? 20) + 3) + 1);
      const pos = (t) => ((t - smin) / (smax - smin)) * 100;
      const grad = [];
      for (let k = 0; k <= 10; k++) { const t = smin + ((smax - smin) * k) / 10; grad.push(`rgb(${rgb(tRGB(t))}) ${k * 10}%`); }
      $("bar").style.background = `linear-gradient(90deg, ${grad.join(",")})`;
      const dk = JSON.stringify(rooms.map((x) => [x.t, x.r.name])) + smin + smax + out + this._sel;
      if ($("dots")._k !== dk) {
        $("dots")._k = dk;
        const sorted = rooms.filter((x) => x.t != null).sort((p, q) => p.t - q.t);
        const W = (this.$("strip").getBoundingClientRect().width || 320) - 12;
        const lanes = [-1e9, -1e9, -1e9];
        const items = sorted.map((x) => ({ x, px: pos(x.t), label: (x.r.short || x.r.name).slice(0, 12) }));
        if (out != null) items.push({ out: true, px: pos(out), label: _("dehors") });
        items.sort((p, q) => p.px - q.px);
        $("dots").innerHTML = items.map((it) => {
          const wPct = ((it.label.length * 5.6 + 8) / W) * 100;
          let lane = lanes.findIndex((r) => it.px - wPct / 2 > r + 1);
          const show = lane >= 0;
          if (show) lanes[lane] = it.px + wPct / 2; else lane = 0;
          if (it.out) return `<span class="dot out" style="left:${it.px}%;--c:200,210,225;--l:${lane}"><i></i>${show ? `<em>${_("dehors")}</em>` : ""}</span>`;
          const x = it.x;
          return `<span class="dot${this._sel === x.i ? " sel" : ""}" style="left:${it.px}%;--c:${rgb(tRGB(x.t))};--l:${lane}" title="${x.r.name} ${fmt(x.t)}°"><i></i>${show ? `<em>${it.label}</em>` : ""}</span>`;
        }).join("") + (a != null ? `<span class="mean" style="left:${pos(a)}%"></span>` : "");
        $("scale").innerHTML = `<span>${smin}°</span><span>${Math.round((smin + smax) / 2)}°</span><span>${smax}°</span>`;
      }

      // tuiles
      const box = $("rooms");
      box.dataset.n = rooms.length;
      if (box.children.length !== rooms.length) {
        box.innerHTML = "";
        rooms.forEach((x) => {
          const el = document.createElement("div");
          el.className = "room";
          el.innerHTML = `<svg class="sp" viewBox="0 0 120 40" preserveAspectRatio="none"><defs><linearGradient id="g${x.i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-opacity=".35"/><stop offset="1" stop-opacity="0"/></linearGradient></defs><path class="ar"/><path class="ln"/></svg>
            <div class="rt"><ha-icon class="ri"></ha-icon><span class="rn"></span></div><span class="bt"></span>
            <div class="rv"><b class="tv"></b><sup>°</sup><span class="tr"></span></div>
            <div class="rh"></div>`;
          let timer = null, held = false;
          el.addEventListener("pointerdown", () => { held = false; timer = setTimeout(() => { held = true; this._more(x.r.temperature); }, 500); });
          ["pointerup", "pointerleave", "pointercancel"].forEach((e) => el.addEventListener(e, () => clearTimeout(timer)));
          el.addEventListener("click", () => { if (held) return; this._sel = this._sel === x.i ? null : x.i; if (this._sel != null && this._period === "7j") this._fetch(true, "7j"); this._render(); });
          box.appendChild(el);
        });
      }
      rooms.forEach((x) => {
        const el = box.children[x.i];
        const c = rgb(tRGB(x.t));
        el.style.setProperty("--c", c);
        el.classList.toggle("sel", this._sel === x.i);
        el.classList.toggle("unav", x.unav);
        el.querySelector(".ri").setAttribute("icon", x.r.icon || "mdi:thermometer");
        el.querySelector(".rn").textContent = x.r.name;
        const bt = el.querySelector(".bt"), bd = cfg.battery_display;
        const showBat = x.bat && bd !== "never" && (bd !== "low" || x.bat.low);
        el.classList.toggle("hasbat", !!showBat);
        el.classList.toggle("hasbatp", !!(showBat && cfg.battery_percent && x.bat.pct != null));
        bt.style.display = showBat ? "" : "none";
        if (showBat) {
          bt.style.setProperty("--b", x.bat.c);
          bt.title = x.bat.pct != null ? _("Batterie {p} %", { p: x.bat.pct }) : x.bat.low ? _("Batterie faible") : _("Batterie");
          bt.innerHTML = `<ha-icon icon="${x.bat.icon}"></ha-icon>${cfg.battery_percent && x.bat.pct != null ? `${x.bat.pct}<small>%</small>` : ""}`;
        }
        el.querySelector(".tv").textContent = fmt(x.t);
        const tr = el.querySelector(".tr");
        if (x.trend != null && Math.abs(x.trend) >= 0.2) {
          tr.innerHTML = `<ha-icon icon="${x.trend > 0 ? "mdi:arrow-top-right" : "mdi:arrow-bottom-right"}"></ha-icon>${x.trend > 0 ? "+" : "−"}${fmt(Math.abs(x.trend))}`;
          tr.className = "tr " + (x.trend > 0 ? "up" : "down");
        } else { tr.innerHTML = x.trend != null ? `<ha-icon icon="mdi:arrow-right"></ha-icon>stable` : ""; tr.className = "tr"; }
        const hh = hum(x.hu);
        el.querySelector(".rh").innerHTML = cfg.show_humidity && hh ? `<span style="--h:${hh.c}"><ha-icon icon="mdi:water"></ha-icon>${fmt(x.hu, 0)} %<small>${hh.t}</small></span>` : "";
        const sk = x.pts.length + ":" + (x.pts.length ? x.pts[x.pts.length - 1].t : 0) + ":" + x.t;
        if (el._sk !== sk) {
          el._sk = sk;
          const p = spark([...x.pts, ...(x.t != null ? [{ t: Date.now(), v: x.t }] : [])], 120, 40, 1);
          el.querySelector(".ln").setAttribute("d", p ? p.line : "");
          el.querySelector(".ar").setAttribute("d", p ? p.area : "");
          el.querySelector(".ar").setAttribute("fill", `url(#g${x.i})`);
          el.querySelectorAll("stop").forEach((s) => s.setAttribute("stop-color", `rgb(${c})`));
        }
      });
      this._renderDetail(rooms);
    }

    _renderDetail(rooms) {
      const d = this.$("detail");
      const x = this._sel != null ? rooms[this._sel] : null;
      if (!x) { d.classList.remove("open"); d.innerHTML = ""; this._dk = null; return; }
      const src = this._period === "7j" ? this._stats7 || {} : this._stats;
      const tp = (src[x.r.temperature] || []).filter((p) => p.v != null);
      const hp = x.r.humidity ? (src[x.r.humidity] || []).filter((p) => p.v != null) : [];
      const dk = this._sel + this._period + tp.length + hp.length + x.t;
      if (this._dk === dk) return;
      this._dk = dk;
      const W = 320, H = 120;
      const vals = tp.map((p) => p.v);
      const mn = vals.length ? Math.min(...tp.map((p) => p.lo ?? p.v)) : null;
      const mx = vals.length ? Math.max(...tp.map((p) => p.hi ?? p.v)) : null;
      const av = avg(vals);
      let svg = "";
      if (tp.length > 1) {
        const t0 = tp[0].t, t1 = Date.now();
        let lo = mn, hi = mx; if (hi - lo < 2) { lo -= 1; hi += 1; }
        const X = (t) => 28 + ((t - t0) / (t1 - t0)) * (W - 36), Y = (v) => 8 + (1 - (v - lo) / (hi - lo)) * (H - 26);
        const path = (arr, key) => arr.map((p, i) => `${i ? "L" : "M"}${X(p.t).toFixed(1)},${Y(p[key]).toFixed(1)}`).join(" ");
        const band = tp.length && tp[0].lo != null ? `${path(tp, "hi")} ${tp.slice().reverse().map((p) => `L${X(p.t).toFixed(1)},${Y(p.lo).toFixed(1)}`).join(" ")} Z` : "";
        let hpath = "";
        if (hp.length > 1) {
          const hl = Math.min(...hp.map((p) => p.v)) - 3, hh = Math.max(...hp.map((p) => p.v)) + 3;
          const YH = (v) => 8 + (1 - (v - hl) / (hh - hl)) * (H - 26);
          hpath = hp.map((p, i) => `${i ? "L" : "M"}${X(p.t).toFixed(1)},${YH(p.v).toFixed(1)}`).join(" ");
        }
        const grid = [lo, (lo + hi) / 2, hi].map((v) => `<line x1="28" x2="${W - 8}" y1="${Y(v)}" y2="${Y(v)}"/><text x="24" y="${Y(v) + 3}">${Math.round(v)}°</text>`).join("");
        const ticks = [];
        const step = this._period === "7j" ? 86400000 : 6 * 3600000;
        for (let t = Math.ceil(t0 / step) * step; t < t1; t += step) {
          const dt = new Date(t);
          ticks.push(`<text class="xt" x="${X(t)}" y="${H - 4}">${this._period === "7j" ? dt.toLocaleDateString(NUMLOC, { weekday: "short" }) : dt.getHours() + "h"}</text>`);
        }
        svg = `<svg viewBox="0 0 ${W} ${H}" class="big"><g class="grid">${grid}</g>${ticks.join("")}
          ${band ? `<path d="${band}" class="band"/>` : ""}${hpath ? `<path d="${hpath}" class="hl"/>` : ""}<path d="${path(tp, "v")}" class="tl"/></svg>`;
      } else svg = `<div class="nodata">${_("Historique en cours de chargement…")}</div>`;
      d.innerHTML = `
        <div class="dh"><span class="dn"><ha-icon icon="${x.r.icon || "mdi:thermometer"}"></ha-icon>${x.r.name}</span>
          <span class="seg"><button data-p="24h" class="${this._period === "24h" ? "on" : ""}">24 h</button><button data-p="7j" class="${this._period === "7j" ? "on" : ""}">${_("7 j")}</button></span>
          <button class="x" title="${_("Fermer")}"><ha-icon icon="mdi:close"></ha-icon></button></div>
        ${svg}
        <div class="dl"><span><i class="lt"></i>${_("Température")}</span>${hp.length > 1 ? `<span><i class="lh"></i>${_("Humidité")}</span>` : ""}
          <span class="mm">${_("min {a} · moy {b} · max {c}", { a: `<b style="color:rgb(${rgb(tRGB(mn))})">${fmt(mn)}°</b>`, b: `<b>${fmt(av)}°</b>`, c: `<b style="color:rgb(${rgb(tRGB(mx))})">${fmt(mx)}°</b>` })}</span></div>`;
      d.style.setProperty("--c", rgb(tRGB(x.t)));
      d.classList.add("open");
      d.querySelector(".x").addEventListener("click", () => { this._sel = null; this._render(); });
      d.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => {
        this._period = b.dataset.p;
        this._dk = null;
        if (this._period === "7j" && !this._stats7) this._fetch(true, "7j");
        this._render();
      }));
    }
    _more(id) {
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
    }

    static css() {
      return `
      :host { display: block; }
      ha-card { display: block; position: relative; overflow: hidden; container-type: inline-size; --f: 74,222,128;
        --tx: #e6f2f5; --tx2: rgba(220,235,240,.62); --hi: #fff; --ink: 255,255,255; --ring: rgba(14,20,28,.95); --chip: rgba(12,18,26,.75); --panel: rgba(0,0,0,.25);
        --bg: linear-gradient(160deg, rgba(20,28,38,.92), rgba(10,15,22,.96)); --shadow: 0 8px 26px rgba(0,0,0,.35); --glow: 1;
        border-radius: var(--ha-card-border-radius, 20px); background: var(--bg);
        border: 1px solid rgba(var(--f), .18); box-shadow: var(--shadow), inset 0 1px 0 rgba(var(--ink),.04); color: var(--tx); user-select: none; }
      :host([data-tone="light"]) ha-card { --tx: #0f172a; --tx2: rgba(15,23,42,.6); --hi: #0f172a; --ink: 15,23,42; --ring: #fff; --chip: rgba(255,255,255,.85); --panel: rgba(15,23,42,.04);
        --bg: linear-gradient(160deg, #ffffff, #f3f6f9); --shadow: 0 6px 20px rgba(15,23,42,.08); --glow: 0; }
      :host([data-tone="theme"]) ha-card { --tx: var(--primary-text-color); --tx2: var(--secondary-text-color); --hi: var(--primary-text-color); --ink: 127,127,127;
        --ring: var(--card-background-color, #fff); --chip: var(--card-background-color, rgba(0,0,0,.4)); --panel: rgba(127,127,127,.08);
        --bg: var(--ha-card-background, var(--card-background-color)); --shadow: var(--ha-card-box-shadow, none); --glow: 0; }
      .amb { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(80% 60% at 100% 0%, rgba(var(--f), .16), transparent 70%); transition: background 1s; }
      button { font: inherit; color: inherit; border: 0; background: none; cursor: pointer; padding: 0; }
      .wrap { position: relative; padding: 12px; display: flex; flex-direction: column; gap: 12px; }

      .head { display: flex; align-items: center; gap: 10px; }
      .fi { flex: 0 0 40px; width: 40px; height: 40px; border-radius: 13px; display: grid; place-items: center; color: rgb(var(--f)); background: rgba(var(--f), .15); box-shadow: inset 0 0 0 1px rgba(var(--f), .28); }
      .fi ha-icon { --mdc-icon-size: 22px; }
      .ft { flex: 1; min-width: 0; }
      .title { font-size: 16px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sub { display: flex; flex-wrap: wrap; align-items: center; gap: 0 4px; font-size: 12px; color: var(--tx2); margin-top: 2px; }
      .sub span { display: inline-flex; align-items: center; gap: 2px; }
      .sub ha-icon { --mdc-icon-size: 14px; }
      .hdrop ha-icon { color: rgb(56,189,248); }
      .avg { text-align: right; line-height: 1; }
      .avg b { font-size: 30px; font-weight: 800; color: rgb(var(--f)); letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
      .avg sup { font-size: 14px; color: rgb(var(--f)); vertical-align: top; }
      .avg small { display: block; font-size: 10px; color: var(--tx2); text-transform: uppercase; letter-spacing: .08em; margin-top: 3px; }

      .strip { position: relative; padding: 44px 6px 14px; }
      .bar { height: 6px; border-radius: 3px; opacity: .85; box-shadow: 0 0 12px rgba(var(--f), .25); }
      .dots { position: absolute; left: 6px; right: 6px; top: 0; height: 56px; }
      .dot { position: absolute; bottom: 5px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; transition: left .8s cubic-bezier(.3,1.2,.5,1); }
      .dot i { width: 12px; height: 12px; border-radius: 50%; background: rgb(var(--c)); box-shadow: 0 0 0 2.5px var(--ring), 0 0 10px rgba(var(--c), calc(.3 + var(--glow) * .7)); order: 2; }
      .dot em { order: 1; font-style: normal; font-size: 9.5px; font-weight: 700; color: var(--tx2); white-space: nowrap; margin-bottom: calc(3px + var(--l) * 11px); }
      .dot.sel i { transform: scale(1.35); } .dot.sel em { color: var(--hi); }
      .dot.out i { background: transparent; box-shadow: 0 0 0 2px rgba(200,210,225,.9); }
      .mean { position: absolute; bottom: 1px; width: 2px; height: 14px; margin-left: -1px; border-radius: 1px; background: var(--hi); opacity: .8; }
      .scale { display: flex; justify-content: space-between; font-size: 9.5px; color: var(--tx2); margin-top: 4px; }

      .rooms { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .room { --c: 74,222,128; position: relative; overflow: hidden; min-width: 0; padding: 10px 10px 8px; border-radius: 16px; cursor: pointer;
        background: linear-gradient(160deg, rgba(var(--c), .12), rgba(var(--ink),.03)); box-shadow: inset 0 0 0 1px rgba(var(--c), .2); transition: transform .15s, box-shadow .3s, background .6s; }
      .room:active { transform: scale(.97); }
      .room.sel { box-shadow: inset 0 0 0 1.5px rgba(var(--c), .8), 0 6px 20px -8px rgb(var(--c)); }
      .room.unav { opacity: .45; }
      .sp { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 30%; pointer-events: none; opacity: .75; }
      .sp .ln { fill: none; stroke: rgb(var(--c)); stroke-width: 1.6; vector-effect: non-scaling-stroke; opacity: .9; }
      .rt { position: relative; display: flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 700; color: var(--tx); min-width: 0; }
      .rt ha-icon { --mdc-icon-size: 16px; color: rgb(var(--c)); flex: 0 0 auto; }
      .rn { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .room.hasbat .rt { padding-right: 22px; } .room.hasbatp .rt { padding-right: 44px; }
      .bt { position: absolute; top: 8px; right: 8px; display: inline-flex; align-items: center; gap: 1px; padding: 1px 4px 1px 2px; border-radius: 8px; font-size: 10.5px; font-weight: 800;
        color: rgb(var(--b)); background: linear-gradient(rgba(var(--b), .16), rgba(var(--b), .16)), var(--chip); font-variant-numeric: tabular-nums; z-index: 1; }
      .bt ha-icon { --mdc-icon-size: 14px; } .bt small { font-size: 8.5px; font-weight: 700; opacity: .8; }
      .rv { position: relative; display: flex; align-items: baseline; gap: 1px; margin-top: 4px; }
      .tv { font-size: 27px; font-weight: 800; letter-spacing: -.03em; color: rgb(var(--c)); font-variant-numeric: tabular-nums; text-shadow: 0 0 18px rgba(var(--c), calc(var(--glow) * .35)); }
      .rv sup { font-size: 13px; color: rgb(var(--c)); align-self: flex-start; margin-top: 3px; }
      .tr { display: inline-flex; align-items: center; margin-left: 6px; font-size: 10.5px; font-weight: 700; color: var(--tx2); }
      .tr ha-icon { --mdc-icon-size: 13px; }
      .tr.up { color: rgb(251,146,60); } .tr.down { color: rgb(56,189,248); }
      .rh { position: relative; min-height: 18px; margin-top: 2px; margin-bottom: 8px; }
      .rh span { display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px 1px 3px; border-radius: 8px; font-size: 11px; font-weight: 700; color: rgb(var(--h)); background: linear-gradient(rgba(var(--h), .16), rgba(var(--h), .16)), var(--chip); backdrop-filter: blur(4px); }
      .rh ha-icon { --mdc-icon-size: 12px; }
      .rh small { font-weight: 600; opacity: .8; margin-left: 4px; }

      .detail { display: none; padding: 10px; border-radius: 16px; background: var(--panel); box-shadow: inset 0 0 0 1px rgba(var(--c), .3); }
      .detail.open { display: block; animation: din .35s cubic-bezier(.3,1.2,.5,1); }
      @keyframes din { from { opacity: 0; transform: translateY(-6px); } }
      .dh { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
      .dn { flex: 1; display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 13.5px; }
      .dn ha-icon { --mdc-icon-size: 18px; color: rgb(var(--c)); }
      .seg { display: flex; padding: 2px; border-radius: 10px; background: rgba(var(--ink),.06); }
      .seg button { padding: 4px 10px; border-radius: 8px; font-size: 11.5px; font-weight: 700; color: var(--tx2); }
      .seg button.on { background: rgba(var(--c), .3); color: var(--hi); }
      .x { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: rgba(var(--ink),.06); }
      .x ha-icon { --mdc-icon-size: 16px; }
      .big { width: 100%; height: auto; display: block; }
      .grid line { stroke: rgba(var(--ink),.1); stroke-dasharray: 3 4; }
      .grid text, .xt { fill: var(--tx2); font-size: 8.5px; text-anchor: end; }
      .xt { text-anchor: middle; }
      .band { fill: rgba(var(--c), .12); }
      .tl { fill: none; stroke: rgb(var(--c)); stroke-width: 2; stroke-linejoin: round; filter: drop-shadow(0 0 4px rgba(var(--c), calc(var(--glow) * .6))); }
      .hl { fill: none; stroke: rgb(56,189,248); stroke-width: 1.4; stroke-dasharray: 4 3; opacity: .8; }
      .dl { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; font-size: 11px; color: var(--tx2); margin-top: 4px; }
      .dl span { display: inline-flex; align-items: center; gap: 5px; }
      .dl i { width: 14px; height: 3px; border-radius: 2px; }
      .lt { background: rgb(var(--c)); } .lh { background: repeating-linear-gradient(90deg, rgb(56,189,248) 0 4px, transparent 4px 7px); }
      .mm { margin-left: auto; } .mm b { color: var(--hi); }
      .nodata { padding: 30px; text-align: center; font-size: 12px; color: var(--tx2); }

      @container (min-width: 520px) { .rooms { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      @container (min-width: 760px) { .rooms { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
      @container (max-width: 300px) { .tv { font-size: 23px; } .rh small { display: none; } .avg b { font-size: 24px; } }
      @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;
    }
  }

  class HolmFloorCardEditor extends HTMLElement {
    // L'éditeur ne se reconstruit que si la configuration change vraiment de l'extérieur : avant, il se
    // reconstruisait quand Home Assistant mettait plus de 0,4 s à renvoyer la configuration (fréquent dans
    // l'application mobile) et le sélecteur d'entité ouvert était détruit avant d'enregistrer le choix (#1).
    setConfig(config) {
      const json = JSON.stringify(config || {});
      // écho d'une config que l'éditeur vient lui-même d'envoyer : on garde l'état local (plus récent)
      if ((this._sent || []).includes(json)) return;
      this._config = JSON.parse(json);
      this._render();
    }
    set hass(hass) {
      this._hass = hass; setLang(hass, this._config);
      this.querySelectorAll("ha-form").forEach((f) => (f.hass = hass));
      if (!this._done) this._render();
    }
    _emit() {
      const cfg = JSON.parse(JSON.stringify(this._config));
      this._sent = [...(this._sent || []), JSON.stringify(cfg)].slice(-20);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
    }
    _form(schema, data, cb, L) {
      const f = document.createElement("ha-form");
      f.hass = this._hass; f.schema = locSchema(schema); f.data = data; f.computeLabel = (s) => (L[s.name] ? _(L[s.name]) : s.name);
      f.computeHelper = (s) => ((this._help || {})[s.name] ? _(this._help[s.name]) : "");
      f.addEventListener("value-changed", (e) => { e.stopPropagation(); f.data = e.detail.value; cb({ ...e.detail.value }); });
      return f;
    }
    _btn(icon, label, fn) {
      const b = document.createElement("ha-icon-button");
      b.label = label; b.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`;
      b.addEventListener("click", (e) => { e.stopPropagation(); fn(); });
      return b;
    }
    _render() {
      if (!this._hass || !this._config) return;
      this._done = true; setLang(this._hass, this._config);
      this._open = this._open || new Set();
      const c = this._config;
      c.rooms = c.rooms || [];
      const L = { language: _("Langue"), title: _("Nom de l'étage"), icon: _("Icône"), outdoor_entity: _("Température extérieure (option)"), hours: _("Heures sur les mini-courbes"), show_humidity: _("Afficher l'humidité"),
        theme: _("Apparence"), battery_display: _("Badge batterie"), battery_percent: _("Afficher le pourcentage"), battery_warn: _("Seuil orange (%)"), battery_low: _("Seuil rouge (%)"),
        name: _("Pièce"), short: _("Nom court (bande)"), temperature: _("Capteur de température"), humidity: _("Capteur d'humidité (option)"), battery: _("Batterie de la sonde (option)") };
      this._help = { battery_display: _("Pour les pièces qui ont un capteur de batterie"), battery_percent: "Si la sonde ne remonte qu\u2019un état « batterie faible », seule l\u2019icône s\u2019affiche" };
      this.innerHTML = `<style>.fl-h{margin:14px 0 6px;font-weight:700;display:flex;align-items:center;gap:8px}ha-expansion-panel{margin:6px 0;border-radius:12px}.fl-r{display:flex;align-items:center;gap:4px}.fl-r .t{flex:1;display:flex;gap:8px;align-items:center;font-weight:600}.fl-add{margin-top:8px}button.fl-add{padding:8px 14px;border-radius:10px;border:1px solid var(--divider-color,#888);background:none;color:var(--primary-color);font:inherit;font-weight:600;cursor:pointer}</style>`;
      this.appendChild(this._form([
        { type: "grid", name: "", schema: [{ name: "title", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
        { name: "outdoor_entity", selector: { entity: { domain: "sensor", device_class: "temperature" } } },
        { type: "grid", name: "", schema: [{ name: "hours", selector: { number: { min: 6, max: 72, step: 6, mode: "box" } } }, { name: "show_humidity", selector: { boolean: {} } }] },
        { name: "theme", selector: { select: { mode: "dropdown", options: [{ value: "auto", label: _("Automatique (suit le mode clair / sombre)") }, { value: "dark", label: _("Sombre") }, { value: "light", label: _("Clair") }, { value: "theme", label: _("Couleurs de mon thème Home Assistant") }] } } },
        { type: "grid", name: "", schema: [
          { name: "battery_display", selector: { select: { mode: "dropdown", options: [{ value: "always", label: _("Toujours") }, { value: "low", label: _("Seulement si faible") }, { value: "never", label: _("Jamais") }] } } },
          { name: "battery_percent", selector: { boolean: {} } },
          { name: "battery_warn", selector: { number: { min: 5, max: 95, step: 5, mode: "box", unit_of_measurement: "%" } } },
          { name: "battery_low", selector: { number: { min: 5, max: 95, step: 5, mode: "box", unit_of_measurement: "%" } } },
        ] },
        langField(),
      ], { language: "", hours: 24, show_humidity: true, theme: "auto", battery_display: "always", battery_percent: false, battery_warn: 30, battery_low: 15, ...c }, (v) => { const relang = (v.language || "") !== (this._config.language || ""); Object.assign(this._config, v); if (!v.language) delete this._config.language; this._emit(); if (relang) setTimeout(() => this._render()); }, L));
      const h = document.createElement("div");
      h.className = "fl-h"; h.innerHTML = `<ha-icon icon="mdi:floor-plan"></ha-icon>${_("Pièces")}`;
      this.appendChild(h);
      c.rooms.forEach((r, i) => {
        const p = document.createElement("ha-expansion-panel");
        p.outlined = true;
        p.expanded = this._open.has(i);
        p.addEventListener("expanded-changed", (e) => { if (e.target !== p) return; if (e.detail && e.detail.expanded) this._open.add(i); else this._open.delete(i); });
        const hd = document.createElement("div");
        hd.slot = "header"; hd.className = "fl-r";
        const t = document.createElement("div");
        t.className = "t";
        const ref = (room) => (t.innerHTML = `<ha-icon icon="${room.icon || "mdi:thermometer"}"></ha-icon>${room.name || _("Pièce {n}", { n: i + 1 })}`);
        ref(r);
        const move = (to) => { const o = new Set([...this._open].map((k) => (k === i ? to : k === to ? i : k))); this._open = o; };
        hd.append(t,
          this._btn("mdi:arrow-up", _("Monter"), () => { if (i > 0) { c.rooms.splice(i - 1, 0, c.rooms.splice(i, 1)[0]); move(i - 1); this._emit(); this._render(); } }),
          this._btn("mdi:delete-outline", _("Supprimer"), () => { c.rooms.splice(i, 1); this._open = new Set([...this._open].filter((k) => k !== i).map((k) => (k > i ? k - 1 : k))); this._emit(); this._render(); }));
        p.appendChild(hd);
        p.appendChild(this._form([
          { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
          { name: "temperature", selector: { entity: { domain: "sensor", device_class: "temperature" } } },
          { name: "humidity", selector: { entity: { domain: "sensor", device_class: "humidity" } } },
          { name: "battery", selector: { entity: { domain: ["sensor", "binary_sensor"], device_class: "battery" } } },
          { name: "short", selector: { text: {} } },
        ], r, (v) => { Object.keys(v).forEach((k) => { if (v[k] === "" || v[k] == null) delete v[k]; }); c.rooms[i] = v; ref(v); this._emit(); }, L));
        this.appendChild(p);
      });
      const tag = customElements.get("ha-button") ? "ha-button" : "button";
      const add = document.createElement(tag);
      add.className = "fl-add";
      add.textContent = _("+ Ajouter une pièce");
      add.addEventListener("click", () => { c.rooms.push({ name: _("Nouvelle pièce") }); this._open.add(c.rooms.length - 1); this._emit(); this._render(); });
      this.appendChild(add);
    }
  }

  if (!customElements.get("holm-floor-card")) customElements.define("holm-floor-card", HolmFloorCard);
  if (!customElements.get("holm-floor-card-editor")) customElements.define("holm-floor-card-editor", HolmFloorCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "holm-floor-card")) {
    setLang(document.querySelector("home-assistant")?.hass);
    window.customCards.push({ type: "holm-floor-card", name: _("HOLM Étage"), description: _("Températures et humidité d'un étage : bande thermique, tuiles pièces avec tendance et courbes."), preview: true });
  }
})();

console.info("%c HOLM-FLOOR %c 1.2.0 ", "background:#4ade80;color:#111;border-radius:3px 0 0 3px", "background:#123;color:#fff;border-radius:0 3px 3px 0");
