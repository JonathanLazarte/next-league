import { useMatchmaking } from '@/hooks/useMatchmaking';
import { memo } from 'react'
import { useI18n } from "@/hooks/useI18n"
import QueueTimer from './QueueTimer'
import PartyBackground from './PartyBackground'
import "./groupPanel.css";


export const PartyPanel = ({ queue }) => {
  const { t } = useI18n();
  const userQueueLabel = (queueName: string) => t(`play.queues.${queueName}.name`);
  const queueMaxPlayers = {
    "ranked_solo_duo": [1,2],
    "swiftplay": [1,2,3,4,5],
    "ranked_flex": [1, 2, 3, 4, 5],
    "aram": [1, 2, 3, 4, 5],
    "aram_mayhem": [1, 2, 3, 4, 5],
    "intro": [1],
    "beginner": [1],
    "intermediate": [1],
  }

  return <div className="group-panel">
    <PartyBackground></PartyBackground>
    <div className="group-header">
      <img className="group-icon" src="/social/party_panel_header_icon.png">
      </img>
      <div className="group-title">
        GRUPO ABIERTO
      </div>
    </div>
    <div className="group-content">
      <img className="map-icon" src="/social/social-icon-victory.png">
      </img>
      <div className="group-queue-info">
        <div className="party-icons">
          {queueMaxPlayers[queue].map((index) =>

            <svg key={index} xmlns="http://www.w3.org/2000/svg"
                 width="60.67" height="72"
                 viewBox="0 0 60.67 72">
              <g>
                <circle cx="30.333" cy="19" r="17"/>
                <path d="M2 70
                  C4.833 58.667 14.75 47.333 30.333 47.333
                  C45.917 47.333 55.833 58.667 58.667 70
                  Z"/>
              </g>
            </svg>

          )}
        </div>
        <div className="queue-name">
          { userQueueLabel(queue) }
        </div>
      </div>
    </div>
  </div>
}

export const QueuePanel = ({ queueStartedAt, handleCancel }) => {

  return <div className="queue-panel">
    <video
      className="eog-looping-bgmagic"
      src="/social/socialpanel_bgloop.webm"
      autoPlay
      loop
      preload="metadata"
    >
    </video>
    <img
      style={{ position: "absolute", width: '100%', zIndex: "-4", top: "0", left: "0", maxWidth: "unset" }}
        src="/social/static_game_panel_bg.png"
        alt="bgmagic-fallback"
      />
    <div className="queue-panel-header">
      <div className="finding-match-title">ENCONTRANDO PARTIDA</div>
      <div className="cancel-inqueue-button" onClick={handleCancel}>
        <svg style={{ pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M5.7143 4L4.00001 5.71429L8.28573 10L4 14.2858L5.71429 16L10 11.7143L14.2857 16L16 14.2857L11.7143 10L16 5.7143L14.2857 4.00001L10 8.28573L5.7143 4Z" fill="#CDBE91" />
        </svg>
      </div>
    </div>
    <div className="queue-panel-main">
      <img className="map-icon" src="/social/social-icon-victory.png"/>
      <div className="inqueue-timer-wrapper">
        <div className="inqueue-time">
          <QueueTimer queueStartedAt={queueStartedAt} />
        </div>
        <div className="estimated-inqueue-time">
          Estimado: 1:16
        </div>
      </div>
    </div>
  </div>
}

const GroupPanel = () => {
  const { queue, queueStatus, queueStartedAt, cancelFindMatch, partyId } = useMatchmaking()

  const handleCancel = () => {
    cancelFindMatch({ partyId })
  }

  if (!queue) return null


  return <>{
    queueStatus === 'searching' ?
      <QueuePanel queueStartedAt={queueStartedAt} handleCancel={handleCancel} /> :
      <PartyPanel queue={queue} />
  }</>
}


export default memo(GroupPanel)
