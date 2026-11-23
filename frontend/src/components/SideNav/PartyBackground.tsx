import { memo } from 'react'

export default function PartyBackground() {
  return <video
    className="eog-looping-bgmagic"
    src="/social/party-status-bg-loop.webm"
    autoPlay
    loop
    preload="metadata"
  ></video>
}
