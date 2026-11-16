"use client";

import React, { useState, useRef} from "react";
import ReactDOM from "react-dom";
import "./TextTooltip.css";
import { SECTION_LABELS } from '@/utils/constants'
import { useI18n } from '@/hooks/useI18n'

interface TextTooltipProps {
  content: string,
  position: { x:number, y: number }
}

const TextTooltip = ({
  content,
  position
}: TextTooltipProps ) => {
  const { t } = useI18n();
  const [visible, /*setVisible*/] = useState(true);
  const tooltipRef = useRef(null);

  return (
    <>
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="mini-tooltip"
            ref={tooltipRef}
            style={{
              top: position?.y | 0,
              left: position?.x | 0,
              position: "fixed",
              visibility: visible ? "visible" : "hidden",
            }}
          >
            {
              t(SECTION_LABELS[content as keyof typeof SECTION_LABELS] || content || '??')
            }
          </div>,
          document.body,
        )}
    </>
  );
};

export default TextTooltip;
