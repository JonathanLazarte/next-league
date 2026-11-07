'use client';

import React, { useState } from 'react';
import { useSound } from '@/hooks/useSound';
import { PatchNotesIcon } from '../LeagueIcons';

export default function PatchNotesSection() {
  const [activeTab, setActiveTab] = useState('highlights');
  const { play: playClick } = useSound('/general/menu-click.mp3');

  return (
    <div className="league-subsection-wrapper">
      <div className="league-promo-container max-w-4xl">
        <div className="league-promo-header">
          <div className="flex items-center gap-2 justify-center mb-1">
            <PatchNotesIcon className="text-[var(--gold-two)]" />
            <span className="text-sm uppercase tracking-widest text-[var(--gold-two)] font-bold">
              ACTUALIZACIÓN 14.23 • TEMPORADA 2026
            </span>
          </div>
          <h1 className="league-promo-title">NOTAS DE LA VERSIÓN</h1>
          <p className="league-promo-subtitle">
            Todos los detalles de los ajustes a campeones, mejoras de objetos, nuevos aspectos True Damage y optimizaciones competitivas.
          </p>
        </div>

        <div className="league-stage-tabs">
          <button
            className={`league-stage-tab ${activeTab === 'highlights' ? 'active' : ''}`}
            onClick={() => {
              playClick();
              setActiveTab('highlights');
            }}
          >
            DESTACADOS
          </button>
          <button
            className={`league-stage-tab ${activeTab === 'champions' ? 'active' : ''}`}
            onClick={() => {
              playClick();
              setActiveTab('champions');
            }}
          >
            CAMPEONES
          </button>
          <button
            className={`league-stage-tab ${activeTab === 'skins' ? 'active' : ''}`}
            onClick={() => {
              playClick();
              setActiveTab('skins');
            }}
          >
            NUEVOS ASPECTOS
          </button>
        </div>

        <div className="league-patch-content-box">
          {activeTab === 'highlights' && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-[var(--gold-one)]">
                Llegada de la Colección True Damage & HEARTSTEEL
              </h3>
              <p className="text-[var(--color-secundary)] leading-relaxed">
                ¡Los grupos musicales más aclamados están de regreso en la tienda! Senna True Damage Know My Name encabeza la rotación mítica con efectos visuales y sonoros renovados.
              </p>
              <h3 className="text-lg font-bold text-[var(--gold-one)] pt-2">
                Ajustes al Modo ARAM Caos
              </h3>
              <p className="text-[var(--color-secundary)] leading-relaxed">
                Nuevos aumentos dorados y prismáticos agregados a la selección inicial, mejorando la diversidad de builds en combates en equipo.
              </p>
            </div>
          )}

          {activeTab === 'champions' && (
            <div className="space-y-4 text-left">
              <div className="border-l-2 border-green-500 pl-3">
                <h4 className="font-bold text-green-400">Akali (Mejora)</h4>
                <p className="text-sm text-[var(--color-secundary)]">
                  Q - Pleno de cinco puntas: Daño base aumentado de 45/70/95/120/145 a 50/75/100/125/150.
                </p>
              </div>
              <div className="border-l-2 border-red-500 pl-3">
                <h4 className="font-bold text-red-400">Yasuo (Ajuste)</h4>
                <p className="text-sm text-[var(--color-secundary)]">
                  Pasiva - Camino del Vagabundo: El escudo en niveles tardíos se ajusta para balancear las interacciones de objetos críticos.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'skins' && (
            <div className="space-y-3 text-left">
              <ul className="list-disc list-inside space-y-1 text-sm text-[var(--gold-two)]">
                <li>Senna True Damage Know My Name (1350 RP)</li>
                <li>Akali True Damage (1350 RP)</li>
                <li>Qiyana True Damage (1350 RP)</li>
                <li>Ekko True Damage (1820 RP - Legendario)</li>
                <li>Jayce T1 & Línea de Campeones Mundiales (1350 RP)</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
