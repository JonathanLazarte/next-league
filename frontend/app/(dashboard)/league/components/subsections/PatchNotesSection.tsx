'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';
import { PatchNotesIcon } from '../LeagueIcons';
import { getPatchNotes } from '../../patchNotesData';
import './PatchNotesSection.css';

export default function PatchNotesSection() {
  const [activeVersion, setActiveVersion] = useState<string>(getPatchNotes("en")[0].version);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { play: playClick } = useSound('/sfx/menu-click.mp3');
  const { t, locale } = useI18n();
  const patches = useMemo(() => getPatchNotes(locale), [locale]);

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
        setActiveVersion(patches[patches.length - 1].version);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const triggerPoint = containerRect.top + 180;

      for (const patch of patches) {
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
  }, [patches]);

  return (
    <div className="patch-notes-wrapper">
      {/* Scrollable Feed View */}
      <div className="patch-notes-view" ref={containerRef}>
        <div className="patch-notes-feed">
        {patches.map((patch, index) => (
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
                  <div className="patch-dev-quote-label">{t("patch.devNote")}</div>
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
            {index < patches.length - 1 && (
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
      <aside className="patch-toc-guide" aria-label={t("patch.history")}>
        <div className="patch-toc-header">{t("patch.versions")}</div>
        {patches.map((patch, idx) => {
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
                {idx === 0 && <span className="patch-toc-tag"> {t("patch.current")}</span>}
              </span>
            </button>
          );
        })}
      </aside>
    </div>
  );
}
