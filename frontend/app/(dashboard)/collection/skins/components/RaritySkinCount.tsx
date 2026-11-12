import { Skin } from "@/types/skin";
import { RARITY_LEVELS } from "@/utils/constants";
import type { TooltipTrigger } from '@/types/ui'
import { getRarityGemUri, LEGACY_ICON_DATA_URI, CHROMA_ICON_DATA_URI } from '@/utils/uiAssets';



interface RaritySkinsCountProps {
  trigger: TooltipTrigger;
  userSkinsFull: Skin[]
}

export default function RaritySkinsCount({ trigger, userSkinsFull }: RaritySkinsCountProps) {
  console.log(trigger)
  const raritys = RARITY_LEVELS;

  const countRarity = userSkinsFull
    ? userSkinsFull?.reduce((acc: Record<string, number>, skin) => {
      acc[skin.rarity] = (acc[skin.rarity] || 0) + 1;
      return acc;
    }, {})
    : raritys.reduce((acc: Record<string, number>, rarity) => {
      acc[rarity] = 0;
      return acc;
    }, {});

  return <div className="rarity-icons-container">

    <div className="rarity-icons">
      {raritys?.map((rarity) => (
        <div key={rarity} className="rarity-item" {...trigger({ content: rarity })}>
          <img
            className="rarity-image"
            src={getRarityGemUri(rarity)}
            alt={`Rareza ${rarity}`}
            width={20}
            height={20}
          />
          {countRarity[rarity] ? countRarity[rarity] : "0"}
        </div>
      ))}
    </div>

    <div className="legacy-chromas-icons">
      <div className="legacy-item" {...trigger({ content: "Legacy" })}>
        <img
          className="rariry-image w-7"
          src={LEGACY_ICON_DATA_URI}
          alt="Legacy"
          width={20}
          height={20}
        />
        {countRarity["NoRarity"] || "0"}
      </div>

      <div className="chroma-item" {...trigger({ content: "Chromas" })}>
        <img
          className="rariry-image w-7"
          src={CHROMA_ICON_DATA_URI}
          alt="Chroma"
          width={20}
          height={20}
        />
        0
      </div>

    </div>

    <svg
      className="skins-hextech-border absolute"
      id="Capa_2"
      data-name="Capa 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 170.3 192.39"
    >
      <g id="Containers">
        <g>
          <g>
            <path
              className="cls-1"
              d="M.5,6.47c3.31,0,6-2.67,6-5.97h157.3c0,3.3,2.69,5.97,6,5.97"
            />
            <path
              className="cls-1"
              d="M11.36,188.16c-1.55-4.48-5.82-7.71-10.86-7.71V12.19c5.04,0,9.31-3.22,10.86-7.71"
            />
            <path
              className="cls-1"
              d="M169.8,185.92c-3.31,0-6,2.67-6,5.97H6.5c0-3.3-2.69-5.97-6-5.97"
            />
            <path
              className="cls-1"
              d="M158.95,4.23c1.55,4.48,5.82,7.71,10.86,7.71v168.26c-5.04,0-9.31,3.22-10.86,7.71"
            />
          </g>
        </g>
      </g>
    </svg>

  </div>
}
