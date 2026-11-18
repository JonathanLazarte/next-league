import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image'
/*import { v4 as uuidv4 } from 'uuid';*/
import "./PvpLobby.css";
import FindMatchButton from "@/components/buttons/FindMatch/FindMatch";
import { setQueue, selectUserInterfaceData } from "@/redux/slices/userInterfaceSlice";
import { useSound } from "@/hooks/useSound"
import { useI18n } from "@/hooks/useI18n"
import { useUser } from '@/hooks/useUser'
import { RESOURCES_URL } from '@/utils/constants'

export default memo(function PvpRoom({ roomTitle }: { roomTitle: string }) {
  const user = useUser();
  const { t } = useI18n();
  const { queueStatus } = useSelector(selectUserInterfaceData)
  const dispatch = useDispatch();
  const { play: playTransToGameselect } = useSound('/sfx/sfx-lobby-trans-to-gameselect.ogg')
  const rankAssetName = user.rank.name.trim().toLowerCase();


  const handleBack = () => {
    playTransToGameselect();
    dispatch(setQueue(null));
  }

  return (
    <section className="pvp-room">
      <div className="room-header">
        <svg
          className={`header-arrow ${queueStatus !== 'idle' ? 'disabled' : ''}`}
          id="Capa_2"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 41.23"
          onClick={() => handleBack()}
        >
          <defs>
            <linearGradient id="active-hextech-metal-gradient" gradientTransform="rotate(90)">
              <stop offset="5%" className="stop-1" stopColor="var(--gold-one)" />
              <stop offset="95%" className="stop-2" stopColor="var(--gold-three)" />
            </linearGradient>
          </defs>
          <g className="header-arrow-border" id="Capa_1-2" data-name="Capa 1">
            <path d="M.03,20.78c-.04-.06-.03-.19,0-.25L20.36,0l9.63,9.59-10.88,11.03,10.88,11.04-9.52,9.57L.03,20.78ZM20.39,36.21l4.6-4.56-10.89-11.03,10.88-10.97-4.55-4.63-15.38,15.54,15.35,15.66Z" />
          </g>
        </svg>
        <div className="header-queue-info">
          <Image
            width={42}
            height={42}
            className="header-map-icon"
            src={`${RESOURCES_URL}/general/mini-sr.png`}
            alt="Map mini icon"
          />
          <h3 className="room-title">{t(`play.queues.${roomTitle}.room`)}</h3>
        </div>
      </div>
      <div className="room-users">
        <div className="room-user">
          <Image
            className="user-banner"
            src={`/bannerskins/worlds_winners_2025_banner.png`}
            sizes={"38rem"}
            width={580}
            height={1480}
            alt="User banner"
          />
          <div className="user-banner-info-container">
            <div className="banner-user-icon">
              <Image
                className="banner-user-border"
                src={`/ranked-emblem/wings/wings_${rankAssetName}_plate.png`}
                sizes={"25rem"}
                width={500}
                height={600}
                alt="User border from banner"
              />
              <Image
                className="banner-user-icon-img"
                src={`${RESOURCES_URL}/profileicon/${user.profile_icon}.png`}
                width={300}
                height={300}
                alt="User icon from banner"
              />
              <video
                className="banner-user-border-magic"
                src={`/ranked-emblem/anim/emblem-wings-magic-${rankAssetName}.webm`}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
              ></video>
            </div>
            <h2 className="banner-username">{user.alias}</h2>
            <span className="banner-alias">{user.title}</span>
          </div>
        </div>
      </div>
      <div className="party-chat"><input type="text" placeholder={t("common.typeHere")}></input></div>
      <FindMatchButton
        queueStatus={queueStatus}
      ></FindMatchButton>
    </section>
  );
});
