'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/hooks/useSound';
import { PatchNotesIcon } from '../LeagueIcons';
import { PATCH_NOTES_DATA } from '../../patchNotesData';
import './PatchNotesSection.css';

export default function PatchNotesSection() {
  const [activeVersion, setActiveVersion] = useState<string>(PATCH_NOTES_DATA[0].version);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { play: playClick } = useSound('/sfx/menu-click.mp3');

  // Smooth scroll to selected version strictly within the container
  const scrollToVersion = (version: string) => {
    playClick();
    setActiveVersion(version);
    const container = containerRef.current;
    const target = sectionRefs.current[version];
    if (target && container) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const scrollPos = container.scrollTop + (targetRect.top - containerRect.top) - 24;
      container.scrollTo({ top: Math.max(0, scrollPos), behavior: 'smooth' });
    }
  };

  // Scrollspy: detect which version is currently active in the viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If reached near bottom, activate the last version
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 60) {
        setActiveVersion(PATCH_NOTES_DATA[PATCH_NOTES_DATA.length - 1].version);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const triggerPoint = containerRect.top + 180;

      for (const patch of PATCH_NOTES_DATA) {
        const el = sectionRefs.current[patch.version];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
            setActiveVersion(patch.version);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="patch-notes-wrapper">
      {/* Scrollable Feed View */}
      <div className="patch-notes-view" ref={containerRef}>
        <div className="patch-notes-feed">
        {PATCH_NOTES_DATA.map((patch, index) => (
          <section
            key={patch.version}
            id={`patch-${patch.version}`}
            ref={(el) => {
              sectionRefs.current[patch.version] = el;
            }}
            className="patch-version-section"
          >
            {/* Header centrado horizontalmente */}
            <div className="patch-header">
              <div className="patch-meta-tag">
                <PatchNotesIcon className="text-[var(--gold-two)]" />
                <span>
                  {patch.season ? `${patch.season} • ` : ''}
                  {patch.date}
                </span>
              </div>
              <h1 className="patch-title">{patch.title}</h1>
              <p className="patch-subtitle">{patch.subtitle}</p>
            </div>

            {/* Contenedor centralizado (ancho ~70%) con texto alineado normal */}
            <div className="patch-content-container">
              {/* Dev Quote / Intro Banner */}
              {patch.devQuote && (
                <div className="patch-dev-quote-box">
                  <div className="patch-dev-quote-label">Nota del Desarrollador</div>
                  <p className="patch-dev-quote-text">&ldquo;{patch.devQuote}&rdquo;</p>
                </div>
              )}

              {/* Subtle Hextech Divider */}
              <div className="hextech-divider">
                <div className="hextech-diamond" />
              </div>

              {/* Changes Feed */}
              <div className="patch-changes-list">
                {patch.changes.map((change, cIdx) => (
                  <div key={cIdx} className="patch-change-item">
                    <h3 className="patch-change-title">{change.title}</h3>

                    {change.context && (
                      <p className="patch-change-context">{change.context}</p>
                    )}

                    {change.details && change.details.length > 0 && (
                      <ul className="patch-change-details">
                        {change.details.map((detail, dIdx) => (
                          <li key={dIdx} className="patch-change-detail">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual separator between different versions */}
            {index < PATCH_NOTES_DATA.length - 1 && (
              <div className="patch-version-separator">
                <div className="patch-version-separator-line" />
                <div className="patch-version-separator-crest">✦</div>
                <div className="patch-version-separator-line" />
              </div>
            )}
          </section>
        ))}
        </div>
      </div>

      {/* Floating TOC Timeline Guide - Fijo y fuera del cálculo del layout */}
      <aside className="patch-toc-guide" aria-label="Historial de versiones">
        <div className="patch-toc-header">Versiones</div>
        {PATCH_NOTES_DATA.map((patch, idx) => {
          const isActive = activeVersion === patch.version;
          return (
            <button
              key={patch.version}
              className={`patch-toc-item ${isActive ? 'active' : ''}`}
              onClick={() => scrollToVersion(patch.version)}
            >
              <span className="patch-toc-dot" />
              <span className="patch-toc-label">
                v{patch.version}
                {idx === 0 && <span className="patch-toc-tag"> (Actual)</span>}
              </span>
            </button>
          );
        })}
      </aside>
    </div>
  );
}
