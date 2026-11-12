export type ChangeCategory = 'feature' | 'improvement' | 'fix';

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

export const PATCH_NOTES_DATA: PatchNote[] = [
  {
    version: '0.4.0',
    season: 'TEMPORADA 2026',
    date: '11 DE NOVIEMBRE, 2026',
    title: 'ARQUITECTURA, CACHÉ Y SECCIÓN LEAGUE',
    subtitle: 'Persistencia de UI Assets en memoria, desacoplamiento del motor de fondos y reestructuración integral de la sección League.',
    devQuote:
      'En esta actualización consolidamos la estabilidad visual y arquitectónica del cliente: erradicamos los parpadeos de interfaz en Colección mediante assets en memoria, modularizamos el BackgroundEngine global y reestructuramos por completo la sección League, estandarizando su barra lateral y convirtiendo las Notas de la Versión en el devlog oficial del proyecto.',
    highlights: {
      features: 2,
      improvements: 3,
      fixes: 2,
    },
    changes: [
      {
        title: 'Reestructuración y Estandarización de la Sección League',
        category: 'feature',
        context:
          'La sección League contenía componentes mockeados redundantes y una estructura no unificada en su menú lateral.',
        details: [
          'Estandarización del ítem "Notas de la versión" en LeagueSidebar para compartir exactamente la misma anatomía, estados activos y thumbnail de 25px ampliado que el resto de los elementos.',
          'Depuración y eliminación definitiva de subsecciones en desuso (PickemsSection, CyanideSection, AramChaosSection y SeasonWorldsSection), aligerando el árbol de componentes.',
          'Integración de la vista completa de Notas de la Versión como devlog interactivo y responsivo dentro del layout principal de League.',
        ],
      },
      {
        title: 'Persistencia de UI Assets en Memoria (Base64)',
        category: 'improvement',
        context:
          'Los marcos de tarjetas y los iconos de rareza parpadeaban al cambiar de pestaña por las cabeceras de revalidación HTTP de Next.js.',
        details: [
          'Bordes de skins (borders_normal.png) e iconos de rareza/chromas/legado embebidos como Data URIs en uiAssets.ts.',
          'Eliminación de llamadas HTTP 304 y retardo de renderizado al alternar entre Colección y otras pestañas del dashboard.',
          'Carga prioritaria (priority={true}) en las primeras filas visibles de la cuadrícula virtualizada para adelantar la descarga de splash arts.',
          'Integración de fallback visual síncrono con Poro Triste ante errores de carga de imágenes en tarjetas.',
        ],
      },
      {
        title: 'Desacoplamiento del BackgroundEngine Global',
        category: 'improvement',
        context:
          'El fondo global del layout contenía lógica de colas y salas exclusiva de la sección /play.',
        details: [
          'Traslado de las capas de fondo de sala y emparejamiento a un componente local PlayBackground.tsx.',
          'Simplificación de BackgroundEngine para resolver fondos de forma limpia mediante BACKGROUND_URLS[actualSection].',
          'Eliminación de estados y objetos { img, options } redundantes en Redux y useUserInterface.',
        ],
      },
      {
        title: 'Corrección de Tooltips y Mapeos de Rareza',
        category: 'fix',
        context:
          'Se normalizó la resolución de recursos en modales flotantes y componentes auxiliares.',
        details: [
          'Resolución del helper getRarityGemUri en SkinTooltip para soporte de gemas Transcendent y Exalted.',
          'Manejo de errores de carga (onError) en tarjetas de campeones y aspectos con preservación de marco y dimensiones.',
        ],
      },
    ],
  },
  {
    version: '0.3.0',
    season: 'TEMPORADA 2026',
    date: '28 DE OCTUBRE, 2026',
    title: 'GRID VIRTUALIZADO Y FILTROS AVANZADOS',
    subtitle: 'Rendimiento fluido para colecciones masivas de campeones y aspectos.',
    devQuote:
      'Para garantizar 60 FPS estables al visualizar cientos de tarjetas con imágenes en alta resolución, rediseñamos la cuadrícula de Colección con técnicas de virtualización reactiva.',
    highlights: {
      features: 2,
      improvements: 2,
      fixes: 1,
    },
    changes: [
      {
        title: 'Cuadrícula Virtualizada con TanStack Virtual',
        category: 'feature',
        context:
          'Renderizado de alto rendimiento condicionado al desplazamiento del usuario.',
        details: [
          'Implementación de VirtualSkinsGrid y VirtualChampionsGrid.',
          'Cálculo dinámico de columnas según el ancho del contenedor con ResizeObserver.',
          'Gestión de overscan inteligente para evitar saltos visuales durante el desplazamiento rápido.',
        ],
      },
      {
        title: 'Sistema de Agrupación y Filtros de Colección',
        category: 'feature',
        context:
          'Nuevos modos de organización para explorar aspectos adquiridos y bloqueados.',
        details: [
          'Agrupamiento por Conjunto, Campeón, Nivel de Rareza y Fecha de Adquisición.',
          'Búsqueda diferida (useDeferredValue) para mantener la interfaz receptiva durante la escritura.',
        ],
      },
      {
        title: 'Optimización de Consumo de Memoria en DOM',
        category: 'improvement',
        context:
          'Evitamos mantener miles de nodos DOM pesados en árboles ocultos.',
        details: [
          'Desmontaje eficiente de subsecciones con preservación de estados clave en almacenamiento reactivo.',
        ],
      },
    ],
  },
  {
    version: '0.2.0',
    season: 'TEMPORADA 2026',
    date: '15 DE OCTUBRE, 2026',
    title: 'SALAS DE JUEGO Y AUDIO HEXTECH',
    subtitle: 'Flujo de emparejamiento interactivo, efectos sonoros y panel social.',
    devQuote:
      'La primera gran iteración enfocada en la inmersión: añadimos el sistema de audio interactivo y la transición visual hacia las salas de juego.',
    highlights: {
      features: 2,
      improvements: 1,
      fixes: 1,
    },
    changes: [
      {
        title: 'Flujo de Matchmaking y Selección de Modo',
        category: 'feature',
        context:
          'Integración de los modos Grieta del Invocador, ARAM y Cooperativo.',
        details: [
          'Diseño de salas con selector de roles y temporizadores de cola.',
          'Confirmación interactiva de partida encontrada con animaciones personalizadas.',
        ],
      },
      {
        title: 'Motor de Efectos de Sonido (SFX)',
        category: 'feature',
        context:
          'Feedback auditivo fiel al cliente oficial de League of Legends.',
        details: [
          'Hook centralizado useSound para eventos de click en menús, hovers en cuadrícula y confirmaciones.',
          'Reproductor de música ambiental con soporte para pistas oficiales.',
        ],
      },
    ],
  },
];
