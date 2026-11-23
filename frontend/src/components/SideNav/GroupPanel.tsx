import { useMatchmaking } from '@/hooks/useMatchmaking';
import { useRef, memo } from 'react'
import { useI18n } from "@/hooks/useI18n"
import QueueTimer from './QueueTimer'
import "./groupPanel.css";

const GroupPanel = () => {
  const { queue, queueStatus, queueStartedAt } = useMatchmaking()
  const animationRefs = useRef<HTMLVideoElement[]>()
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

  if (!queue) return null


  const PartyPanel = () => {
    return <div className="group-panel">
      <video
        className="eog-looping-bgmagic"
        src="/social/party-status-bg-loop.webm"
        autoPlay
        loop
      ></video>
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

  const QueuePanel = () => {
    return <div className="queue-panel">
      <video
        className="eog-looping-bgmagic"
        src="/social/socialpanel_bgloop.webm"
        autoPlay
        loop
      ></video>
      <div className="queue-panel-header">
        <div className="finding-match-title">ENCONTRANDO PARTIDA</div>
        <div className="cancel-inqueue-button"></div>
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


  return <>
    {
      queueStatus === 'searching'? <QueuePanel></QueuePanel> : <PartyPanel></PartyPanel>
    }
  </>
}


export default memo(GroupPanel)
