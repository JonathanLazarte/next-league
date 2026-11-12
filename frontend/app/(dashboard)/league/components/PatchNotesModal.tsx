'use client';

import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useSound } from '@/hooks/useSound';
import { PATCH_NOTES_DATA } from '../patchNotesData';

interface PatchNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatchNotesModal({ isOpen, onClose }: PatchNotesModalProps) {
  const { play: playClick } = useSound('/general/confirm-button-cancel-click.mp3');
  const latestPatch = PATCH_NOTES_DATA[0];

  if (!isOpen) return null;

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <div className="league-modal-backdrop" onClick={handleClose}>
      <div className="league-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="league-modal-header">
          <h2 className="league-modal-title">
            NOTAS DE LA VERSIÓN {latestPatch.version} - {latestPatch.season || 'TEMPORADA 2026'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="league-modal-body">
          <h3 className="text-xl font-bold text-[#f0e6d2] mb-1">{latestPatch.title}</h3>
          <p className="text-xs uppercase tracking-wider text-[var(--gold-two)] mb-3">
            {latestPatch.date}
          </p>
          <p className="mb-4 text-[#a09b8c] italic">
            &ldquo;{latestPatch.devQuote}&rdquo;
          </p>

          <h4 className="text-lg font-bold text-[#c8aa6e] mb-3">Cambios Destacados</h4>
          <div className="space-y-4">
            {latestPatch.changes.map((change, i) => (
              <div key={i} className="border-l-2 border-[var(--gold-two)] pl-3">
                <h5 className="font-bold text-[#f0e6d2] text-sm">{change.title}</h5>
                {change.context && (
                  <p className="text-xs text-[#a09b8c] mb-1">{change.context}</p>
                )}
                <ul className="list-disc list-inside space-y-0.5 text-xs text-[#cdbe91]">
                  {change.details.map((d, dIdx) => (
                    <li key={dIdx}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
