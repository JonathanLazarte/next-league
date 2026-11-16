import { useSound } from '@/hooks/useSound'
import { useI18n } from '@/hooks/useI18n'
import { useRouter } from '@/hooks/useRouter'
import { useUserInterface } from '@/hooks/useUserInterface';
import { useState, useRef } from 'react'
import type { CSSProperties, Dispatch } from 'react';
import type { Section, TooltipTrigger } from '@/types/ui';
/*import { flushSync } from "react-dom";*/

interface HeaderTabProps {
  type: string;
  section: Section;
  trigger?: TooltipTrigger;
  setSectionTabSelected: Dispatch<React.SetStateAction<Section | null>>;
  sectionTabSelected: Section | null;

}

export default function HeaderTab({
  type,
  section,
  trigger,
  setSectionTabSelected,
  sectionTabSelected
}: HeaderTabProps) {
  const { play } = useSound("/sfx/menu-click.mp3");
  const { t } = useI18n();
  const { push } = useRouter()
  const { isNavigating, actualSection } = useUserInterface()
  const [pointer, setPointer] = useState<{ x: number | undefined, intensity: number }>({ x: undefined, intensity: 1 })
  const lightRef = useRef<HTMLDivElement | null>(null)
  /*const [isMouseUp, setIsMouseUp] = useState();*/

  const isPointerVisible = sectionTabSelected === section || !isNavigating && (actualSection === section);
  const handleClick = (section: Section) => {
    if( section === actualSection || section === sectionTabSelected) return
    /*flushSync(() => {
      setIsMouseUp(true);
    });*/
    play();
    setSectionTabSelected(section)
    push(section)
  };

  const getTabClass = (section: string) => {
    if (sectionTabSelected === section) return "selected"
    if (!isNavigating) {
      if (actualSection === section ) return "actual-section"
    }
    return ""
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = lightRef.current;
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const center = rect.width / 2;

    const intensity = Math.max(0, 1 - Math.abs(x - center) / center);

    element.style.setProperty('--pointer-x', `${x}px`)
    element.style.setProperty('--pointer-intensity', `${intensity.toString()}`)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = lightRef.current;
    if (!element) return;
    element.style.setProperty('--pointer-intensity', `0`)
  }


  if (section === "league")
    return (
      <div
        onMouseUp={() => handleClick("league")}
        onMouseMove={handleMouseMove}
        className={`header-tab ${getTabClass('league')} main`}
        data-testid={`tab-${section}`}
        ref={lightRef}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="tab-pointer-base"
        />
        <div
          className="tab-pointer-light"
        />
        {t("sections.league")}
        <img
          style={{
            display: isPointerVisible ? "block" : "none",
          }}
          className="header-pointer"
          src="/header-pointer.png"
        />
      </div>
    );

  return (
    <div
      className={`header-tab ${getTabClass(section)}`}
      onMouseUp={() => handleClick(section)}
      onMouseMove={handleMouseMove}
      {...trigger?.({ content: section, addOnMouseLeave: handleMouseLeave })}
      data-testid={`tab-${section}`}
      ref={lightRef}
    >
      <div
        className="tab-pointer-base"
      />
      <div
        className="tab-pointer-light"
      />
      <img
        style={{
          display: isPointerVisible ? "block" : "none",
        }}
        className="header-pointer"
        src="/header-pointer.png"
      />
      <svg fill="currentColor">
        <use href={`/icon.svg#${section}`} />
      </svg>
    </div>
  );
}
