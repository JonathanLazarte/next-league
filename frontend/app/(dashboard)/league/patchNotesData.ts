export type ChangeCategory = "feature" | "improvement" | "fix";

export interface PatchChange {
  title: string;
  category: ChangeCategory;
  context?: string;
  details: string[];
}

export interface PatchNote {
  version: string;
  season?: string;
  date: string;
  title: string;
  subtitle: string;
  devQuote: string;
  highlights?: {
    features: number;
    improvements: number;
    fixes: number;
  };
  changes: PatchChange[];
}

interface PatchText {
  season: string;
  date: string;
  title: string;
  subtitle: string;
  devQuote: string;
  changes: { title: string; context?: string; details: string[] }[];
}

const PATCH_META: { version: string; categories: ChangeCategory[]; highlights: PatchNote["highlights"] }[] = [
  {
    version: "0.5.0",
    highlights: { features: 2, improvements: 2, fixes: 0 },
    categories: ["feature", "improvement", "improvement", "feature"],
  },
  {
    version: "0.4.0",
    highlights: { features: 2, improvements: 3, fixes: 2 },
    categories: ["feature", "improvement", "improvement", "fix"],
  },
  {
    version: "0.3.0",
    highlights: { features: 2, improvements: 2, fixes: 1 },
    categories: ["feature", "feature", "improvement"],
  },
  {
    version: "0.2.0",
    highlights: { features: 2, improvements: 1, fixes: 1 },
    categories: ["feature", "feature"],
  },
];

const PATCH_TEXT: Record<"es" | "en", PatchText[]> = {
  es: [
    {
      season: "TEMPORADA 2026",
      date: "14 DE NOVIEMBRE, 2026",
      title: "IDIOMAS DEL CLIENTE",
      subtitle: "Textos de la interfaz separados en español e inglés, con cambio desde Ajustes.",
      devQuote:
        "El cliente deja de mezclar idiomas. Cada frase vive en un diccionario por idioma, y el jugador elige cuál ver.",
      changes: [
        {
          title: "Paquetes de idioma y selector",
          context: "Los textos estaban escritos directo en los componentes, unos en inglés y otros en español.",
          details: [
            "Diccionario es/en en src/i18n/messages.ts y hook useI18n.",
            "Nueva sección Cliente en Ajustes para alternar Español e English. La elección se guarda en el navegador.",
            "La pestaña League y la pestaña PVP del selector de modo conservan ese nombre en ambos idiomas.",
          ],
        },
        {
          title: "Cobertura de la interfaz",
          context: "Las pantallas más visibles ya leen el idioma activo.",
          details: [
            "Acceso: iniciar sesión, invitado, registro y avisos legales.",
            "Play: modos, colas, títulos de sala y botones Confirmar, Buscar partida y Jugar.",
            "Tienda y colección: panel lateral, filtros, roles y rarezas.",
            "Notas de la versión: el contenido también tiene versión en español y en inglés dentro de patchNotesData.ts.",
          ],
        },
        {
          title: "Carga visual y salas más ágiles",
          context: "Ajustamos los recursos que aparecen al navegar por la aplicación y entrar a una sala.",
          details: [
            "Los placeholders de tarjetas usan blue-five con un brillo Hextech dorado muy tenue; las imágenes hero ya no usan ese placeholder.",
            "La pantalla de servidor en despliegue usa un aro segmentado dorado sobre blue-five, con contador e intentos activos.",
            "Los assets inmediatos de sala se precargan en tiempo ocioso tras iniciar sesión y las alas siguen el rango real del usuario.",
          ],
        },
        {
          title: "Controles en preparación y reporte de errores",
          context: "Las acciones aún no disponibles ahora comunican claramente su estado.",
          details: [
            "Comprar RP, los accesos de la cabecera de Tienda, los iconos sociales y los botones inferiores no funcionales muestran el estado deshabilitado del cliente.",
            "El botón Reportar un error abre un formulario Hextech que guarda el comentario localmente hasta conectar su entrega al backend.",
            "El tooltip de campeones completa las traducciones de puntos de maestría y series de Eternals.",
          ],
        },      ],
    },
    {
      season: "TEMPORADA 2026",
      date: "11 DE NOVIEMBRE, 2026",
      title: "ARQUITECTURA, CACHÉ Y SECCIÓN LEAGUE",
      subtitle: "Persistencia de UI Assets en memoria, desacoplamiento del motor de fondos y reestructuración integral de la sección League.",
      devQuote:
        "En esta actualización consolidamos la estabilidad visual y arquitectónica del cliente: erradicamos los parpadeos de interfaz en Colección mediante assets en memoria, modularizamos el BackgroundEngine global y reestructuramos por completo la sección League, estandarizando su barra lateral y convirtiendo las Notas de la Versión en el devlog oficial del proyecto.",
      changes: [
        {
          title: "Reestructuración y estandarización de la sección League",
          context: "La sección League contenía componentes mockeados redundantes y una estructura no unificada en su menú lateral.",
          details: [
            "Estandarización del ítem Notas de la versión en LeagueSidebar para compartir la misma anatomía, estados activos y miniatura de 25px que el resto de los elementos.",
            "Eliminación de subsecciones en desuso (Pickems, Cyanide, Aram Chaos y Season Worlds), aligerando el árbol de componentes.",
            "Integración de la vista completa de Notas de la versión como devlog dentro del layout principal de League.",
          ],
        },
        {
          title: "Persistencia de UI assets en memoria",
          context: "Los marcos de tarjetas y los iconos de rareza parpadeaban al cambiar de pestaña por las cabeceras de revalidación HTTP de Next.js.",
          details: [
            "Bordes de skins e iconos de rareza, chromas y legado embebidos como Data URIs en uiAssets.ts.",
            "Eliminación de llamadas HTTP 304 y del retardo al alternar entre Colección y otras pestañas.",
            "Carga prioritaria en las primeras filas visibles de la cuadrícula para adelantar los splash arts.",
            "Fallback visual con Poro triste ante errores de carga de imágenes en tarjetas.",
          ],
        },
        {
          title: "Desacoplamiento del BackgroundEngine global",
          context: "El fondo global del layout contenía lógica de colas y salas exclusiva de la sección Play.",
          details: [
            "Traslado de las capas de fondo de sala y emparejamiento a PlayBackground.tsx.",
            "BackgroundEngine resuelve fondos mediante BACKGROUND_URLS[actualSection].",
            "Eliminación de estados redundantes en Redux y useUserInterface.",
          ],
        },
        {
          title: "Corrección de tooltips y mapeos de rareza",
          context: "Se normalizó la resolución de recursos en modales flotantes y componentes auxiliares.",
          details: [
            "getRarityGemUri en SkinTooltip cubre las gemas Transcendent y Exalted.",
            "Errores de carga en tarjetas de campeones y aspectos conservan el marco y las dimensiones.",
          ],
        },
      ],
    },
    {
      season: "TEMPORADA 2026",
      date: "28 DE OCTUBRE, 2026",
      title: "GRID VIRTUALIZADO Y FILTROS AVANZADOS",
      subtitle: "Rendimiento fluido para colecciones masivas de campeones y aspectos.",
      devQuote:
        "Para garantizar 60 FPS estables al visualizar cientos de tarjetas con imágenes en alta resolución, rediseñamos la cuadrícula de Colección con técnicas de virtualización.",
      changes: [
        {
          title: "Cuadrícula virtualizada con TanStack Virtual",
          context: "Renderizado de alto rendimiento condicionado al desplazamiento del usuario.",
          details: [
            "Implementación de VirtualSkinsGrid y VirtualChampionsGrid.",
            "Cálculo dinámico de columnas según el ancho del contenedor con ResizeObserver.",
            "Overscan para evitar saltos visuales durante el desplazamiento rápido.",
          ],
        },
        {
          title: "Agrupación y filtros de colección",
          context: "Nuevos modos de organización para explorar aspectos obtenidos y bloqueados.",
          details: [
            "Agrupamiento por conjunto, campeón, rareza y fecha de adquisición.",
            "Búsqueda diferida para mantener la interfaz receptiva mientras se escribe.",
          ],
        },
        {
          title: "Menos nodos en el DOM",
          context: "Evitamos mantener miles de nodos pesados en árboles ocultos.",
          details: [
            "Desmontaje de subsecciones con preservación de estados clave.",
          ],
        },
      ],
    },
    {
      season: "TEMPORADA 2026",
      date: "15 DE OCTUBRE, 2026",
      title: "SALAS DE JUEGO Y AUDIO HEXTECH",
      subtitle: "Flujo de emparejamiento interactivo, efectos sonoros y panel social.",
      devQuote:
        "La primera gran iteración enfocada en la inmersión: añadimos el sistema de audio interactivo y la transición visual hacia las salas de juego.",
      changes: [
        {
          title: "Matchmaking y selección de modo",
          context: "Integración de Grieta del Invocador, ARAM y Cooperativo.",
          details: [
            "Salas con selector de roles y temporizadores de cola.",
            "Confirmación de partida encontrada con animaciones.",
          ],
        },
        {
          title: "Motor de efectos de sonido",
          context: "Feedback auditivo alineado con el cliente de League of Legends.",
          details: [
            "Hook useSound para clicks de menú, hovers de cuadrícula y confirmaciones.",
            "Reproductor de música ambiental con pistas de fondo.",
          ],
        },
      ],
    },
  ],
  en: [
    {
      season: "SEASON 2026",
      date: "NOVEMBER 14, 2026",
      title: "CLIENT LANGUAGES",
      subtitle: "Interface copy split into Spanish and English, switched from Settings.",
      devQuote:
        "The client no longer mixes languages. Each line lives in a per-language dictionary, and the player chooses which one to see.",
      changes: [
        {
          title: "Language packs and switcher",
          context: "Copy was written straight into components, some of it in English and some in Spanish.",
          details: [
            "Spanish and English dictionaries in src/i18n/messages.ts, plus the useI18n hook.",
            "New Client section in Settings to switch between Español and English. The choice is stored in the browser.",
            "The League tab and the PVP mode-select tab keep those names in both languages.",
          ],
        },
        {
          title: "Interface coverage",
          context: "The most visible screens now follow the active language.",
          details: [
            "Auth: sign-in, guest, register, and the legal notice.",
            "Play: modes, queues, room titles, and the Confirm, Find Match, and Play buttons.",
            "Store and collection: side panel, filters, roles, and rarities.",
            "Patch notes: the body also has a Spanish and an English version in patchNotesData.ts.",
          ],
        },
        {
          title: "Faster visual loading and rooms",
          context: "We tuned the assets used while moving through the client and entering a room.",
          details: [
            "Card placeholders use blue-five with a subtle gold Hextech glow; hero images no longer use that placeholder.",
            "The server-deploying screen uses a gold segmented ring on blue-five, with active elapsed time and attempts.",
            "Immediate room assets preload during idle time after sign-in, and wings follow the user's actual rank.",
          ],
        },
        {
          title: "In-progress controls and bug reports",
          context: "Actions that are not available yet now clearly communicate their state.",
          details: [
            "Buy RP, Store header shortcuts, social icons, and inactive bottom buttons now use the client's disabled state.",
            "Report a bug opens a compact Hextech form that keeps comments locally until backend delivery is connected.",
            "Champion tooltips now translate mastery-point suffixes and Eternal series.",
          ],
        },      ],
    },
    {
      season: "SEASON 2026",
      date: "NOVEMBER 11, 2026",
      title: "ARCHITECTURE, CACHE, AND THE LEAGUE SECTION",
      subtitle: "In-memory UI assets, a decoupled background engine, and a full rebuild of the League section.",
      devQuote:
        "This update locks in the client's visual and architectural stability: collection flicker is gone thanks to in-memory assets, the global BackgroundEngine is now a module of its own, and the League section was rebuilt with a consistent sidebar and patch notes as the project's official devlog.",
      changes: [
        {
          title: "League section rebuilt to one standard",
          context: "League still carried redundant mock components and a sidebar that did not share one layout.",
          details: [
            "The Patch Notes item in LeagueSidebar now uses the same anatomy, active states, and 25px thumbnail as every other entry.",
            "Unused subsections (Pickems, Cyanide, Aram Chaos, and Season Worlds) were removed.",
            "The full Patch Notes view now lives inside the main League layout as an interactive devlog.",
          ],
        },
        {
          title: "UI assets kept in memory",
          context: "Card frames and rarity icons flickered on tab changes because of Next.js HTTP revalidation headers.",
          details: [
            "Skin borders and rarity, chroma, and legacy icons are embedded as data URIs in uiAssets.ts.",
            "HTTP 304 calls and the delay when leaving Collection are gone.",
            "The first visible grid rows load with priority so splash art starts sooner.",
            "Cards fall back to a sad Poro when an image fails, without losing the frame.",
          ],
        },
        {
          title: "Global BackgroundEngine split out",
          context: "The layout background still contained queue and room logic that belongs only to Play.",
          details: [
            "Room and matchmaking background layers moved to PlayBackground.tsx.",
            "BackgroundEngine now resolves backgrounds through BACKGROUND_URLS[actualSection].",
            "Redundant Redux and useUserInterface state was removed.",
          ],
        },
        {
          title: "Tooltip and rarity mapping fixes",
          context: "Floating modals and helper components now resolve assets the same way.",
          details: [
            "getRarityGemUri in SkinTooltip covers Transcendent and Exalted gems.",
            "Champion and skin cards keep their frame and size when an image fails to load.",
          ],
        },
      ],
    },
    {
      season: "SEASON 2026",
      date: "OCTOBER 28, 2026",
      title: "VIRTUAL GRID AND ADVANCED FILTERS",
      subtitle: "Smooth scrolling for large champion and skin collections.",
      devQuote:
        "To hold a steady 60 FPS while showing hundreds of high-resolution cards, the Collection grid was rebuilt with virtualization.",
      changes: [
        {
          title: "Virtualized grid with TanStack Virtual",
          context: "Only the rows near the scroll position are rendered.",
          details: [
            "VirtualSkinsGrid and VirtualChampionsGrid.",
            "Column count follows the container width through a ResizeObserver.",
            "Overscan avoids visual jumps during fast scrolling.",
          ],
        },
        {
          title: "Collection grouping and filters",
          context: "New ways to browse owned and locked skins.",
          details: [
            "Group by set, champion, rarity, and acquisition date.",
            "Deferred search so typing stays responsive.",
          ],
        },
        {
          title: "Fewer DOM nodes",
          context: "Hidden trees no longer keep thousands of heavy nodes mounted.",
          details: [
            "Subsections unmount while key state stays in React state.",
          ],
        },
      ],
    },
    {
      season: "SEASON 2026",
      date: "OCTOBER 15, 2026",
      title: "GAME ROOMS AND HEXTECH AUDIO",
      subtitle: "Interactive matchmaking, sound effects, and the social panel.",
      devQuote:
        "The first pass focused on immersion: an interactive audio system and the visual handoff into game rooms.",
      changes: [
        {
          title: "Matchmaking and mode select",
          context: "Summoner's Rift, ARAM, and Co-op vs AI.",
          details: [
            "Rooms with a role selector and queue timers.",
            "Match-found confirmation with its own animations.",
          ],
        },
        {
          title: "Sound-effect engine",
          context: "Audio feedback in line with the League of Legends client.",
          details: [
            "useSound handles menu clicks, grid hovers, and confirmations.",
            "An ambient music player for background tracks.",
          ],
        },
      ],
    },
  ],
};

export function getPatchNotes(locale: string): PatchNote[] {
  const lang = locale === "en" ? "en" : "es";
  return PATCH_META.map((meta, index) => {
    const text = PATCH_TEXT[lang][index];
    return {
      version: meta.version,
      highlights: meta.highlights,
      season: text.season,
      date: text.date,
      title: text.title,
      subtitle: text.subtitle,
      devQuote: text.devQuote,
      changes: text.changes.map((change, changeIndex) => ({
        ...change,
        category: meta.categories[changeIndex],
      })),
    };
  });
}
