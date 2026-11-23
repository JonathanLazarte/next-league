"use client"

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useMatchmaking } from '@/hooks/useMatchmaking';
import ConfirmButton from '@/components/buttons/Confirm/Confirm';
import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/hooks/useI18n';
import { GAME_DATA } from '@/utils/constants';


type GameMode = typeof GAME_DATA[keyof typeof GAME_DATA][number]

type Queue = GameMode["queues"][number]

interface RenderQueueSelectorProps {
  gameMode: GameMode;
  setSelectedQueueGlobal: (queue: string) => void;
}

const RenderQueueSelector = ({ gameMode, setSelectedQueueGlobal }: RenderQueueSelectorProps) => {
  const { t } = useI18n();
  const [ queueSelected, setQueueSelected ] = useState(gameMode.queues[0]);
  const { play: playQueueClick } = useSound('/sfx/sfx-soc-ui-click-generic.ogg');

  const handleClick = (queue: Queue) => {
    if(queueSelected.name !== queue.name) {
      setQueueSelected(queue);
      setSelectedQueueGlobal(queue.name);
      playQueueClick();
    }
  };
  return (
    <div className="queues-wrapper" key={gameMode.id} >
      <div className="gamemode-description">
        <p>{t(`play.queues.${queueSelected.name}.description`)}</p>
      </div>
      {
        gameMode?.queues?.map((queue, index) => (
          <div
            className={`queue-option ${queueSelected.name === queue.name ? 'selected' : ''}`}
              onClick={() => handleClick(queue)}
              key={index}
            >
            <div className="custom-checkbox">
              {queueSelected.name === queue.name && <div className="checkboxMark" />}
            </div>
            <span>{t(`play.queues.${queue.name}.name`)}</span>
          </div>
        ))
      }
    </div>
  );
};

interface RenderGameModeProps {
  gameMode: GameMode;
  selectedMap: string;
  hoveredMap: string;
  setSelectedMap: React.Dispatch<React.SetStateAction<string>>;
  setHoveredMap: React.Dispatch<React.SetStateAction<string>>;
  setSelectedQueueGlobal: React.Dispatch<React.SetStateAction<string>>;
}

const RenderGameMode = ({ gameMode, selectedMap, hoveredMap, setSelectedMap, setHoveredMap, setSelectedQueueGlobal }: RenderGameModeProps) => {
  const { t } = useI18n();
  const { play: playGameModeHover } = useSound('/sfx/sfx-gameselect-button-hover.ogg');
  const { play : playGameModeClick } = useSound('/sfx/sfx-gameselect-button-map-click.ogg');
  const handleMouseEnter = () => {
    if(selectedMap !== gameMode.id) {
      setHoveredMap(gameMode.id);
      playGameModeHover();
    }
  };
  const handleClick = () => {
    if(selectedMap !== gameMode.id) {
      playGameModeClick();
      setSelectedMap(gameMode.id);
      hoveredMap === gameMode.id && setHoveredMap('');
    }
  };
  const mapName = t(`play.maps.${gameMode.id}`);

  return (
    <div className={`gamemode-wrapper ${hoveredMap === gameMode.id ? 'hovered' : ''} ${selectedMap === gameMode.id ? 'active' : ''}`}>
      <div className="gamemode-icon"
        onMouseLeave={() => setHoveredMap('')}
        onMouseEnter={() => handleMouseEnter()}
        onClick={() => handleClick()}
      >
        <div className='map-img-wrapper'>
          <img
            src={`/general/${gameMode.disabledImg}`}
            alt={mapName}
          />
          <img
            className='hover-img'
            src={`/general/${gameMode.hoverImg}`}
            alt={mapName}
            style={{opacity: gameMode.id === hoveredMap ? 1 : 0}}
          />
          <img
            className='enabled-img'
            src={`/general/${gameMode.enabledImg}`}
            alt={mapName}
            style={{opacity: gameMode.id === selectedMap ? 1 : 0}}
          />
          {/*<video
            className="gamemode-active-animation"
            src="/gamemode-selection/game-select-icon-active.webm"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            style={{opacity: gameMode.id === selectedMap ? 1 : 0}}
          ></video>*/}
        </div>
        <span className="mode-subtitle">{gameMode.subTitle}</span>
        <h1 className="mode-title">{mapName}</h1>
        <div className="dividing-line"></div>
      </div>
      <RenderQueueSelector setSelectedQueueGlobal={setSelectedQueueGlobal} gameMode={gameMode} />
    </div>
  );
}

interface ModeSelectorProps {
  data: typeof GAME_DATA[keyof typeof GAME_DATA];
  comeback: () => void;
}

export default function ModeSelector({ data: gameModes, comeback }: ModeSelectorProps) {
  const router = useRouter();
	const [ selectedMap, setSelectedMap ] = useState<string>(gameModes[0].id);
	const [ hoveredMap, setHoveredMap ] = useState('');
  const [ selectedQueueGlobal, setSelectedQueueGlobal ] = useState(gameModes[0].queues[0].name);
  const { queue, createParty } = useMatchmaking()


  const handleConfirm = () => {
    if (queue === selectedQueueGlobal) {
      comeback()
    };
    createParty({ queue: selectedQueueGlobal})
  };
  const handleBack = () => {
    if (queue) {
      comeback()
    } else {
      router.push("league");
    }
  }

  useEffect(() => {
    const selectedMapData = gameModes.find(map => map.id === selectedMap);
    if(selectedMapData) setSelectedQueueGlobal(selectedMapData.queues[0].name);
  }, [selectedMap])

	return <>

      <div className="gamemode-selector">
        <div className='gamemodes-grid'>
        {gameModes.map((gameMode, index) => (
          <RenderGameMode gameMode={gameMode} selectedMap={selectedMap} setSelectedMap={setSelectedMap} hoveredMap={hoveredMap} setHoveredMap={setHoveredMap} setSelectedQueueGlobal={setSelectedQueueGlobal} key={index} />
        ))}
        </div>
        <div className='gamemode-selector-footer'>
          <ConfirmButton
            confirmAction={handleConfirm}
            backAction={handleBack}
          />
        </div>
      </div>
    </>
}
