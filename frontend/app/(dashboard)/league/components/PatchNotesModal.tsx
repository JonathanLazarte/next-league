'use client';

import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useSound } from '@/hooks/useSound';

interface PatchNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatchNotesModal({ isOpen, onClose }: PatchNotesModalProps) {
  const { play: playClick } = useSound('/general/confirm-button-cancel-click.mp3');

  if (!isOpen) return null;

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <div className="league-modal-backdrop" onClick={handleClose}>
      <div className="league-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="league-modal-header">
          <h2 className="league-modal-title">NOTAS DE LA VERSIÓN - TEMPORADA 2026</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="league-modal-body">
          <h3 className="text-xl font-bold text-[#f0e6d2] mb-3">Aspectos Destacados de la Versión</h3>
          <p className="mb-4 text-[#a09b8c]">
            ¡Bienvenidos a la versión de Worlds 2026! Esta actualización incluye el regreso estelar del grupo <strong>True Damage</strong> y nuevas incorporaciones para la colección <strong>HEARTSTEEL</strong>, además de mejoras de rendimiento y ajustes de balance para la Grieta del Invocador y ARAM.
          </p>

          <h4 className="text-lg font-bold text-[#c8aa6e] mb-2">Aspectos Nuevos y Prestigiosos</h4>
          <ul className="list-disc list-inside space-y-1 mb-4 text-[#cdbe91]">
            <li>Senna True Damage Know My Name (1350 RP)</li>
            <li>Akali True Damage (1350 RP)</li>
            <li>Qiyana True Damage (1350 RP)</li>
            <li>Ekko True Damage (1820 RP)</li>
            <li>Yasuo True Damage (1350 RP)</li>
            <li>Colección completa HEARTSTEEL (Ezreal, Kayn, Sett, Yone, Aphelios, K&apos;Sante)</li>
          </ul>

          <h4 className="text-lg font-bold text-[#c8aa6e] mb-2">Modo Temporal: ARAM Caos</h4>
          <p className="text-[#a09b8c]">
            Prueba aumentos exclusivos en el Abismo de los Lamentos con selecciones aleatorias de bendiciones Hextech.
          </p>
        </div>
      </div>
    </div>
  );
}
