import { useEffect } from 'react'
import type { Socket } from 'socket.io-client'
import { useMatchmaking } from '@/hooks/useMatchmaking'

export function useMatchmakingSocket(socket: Socket | null) {
  const { setParty, setQueueStatus } = useMatchmaking()

  useEffect(() => {
    if (!socket) return;

    socket.on('party:set', ({ queue, partyOwner, partyId }) => {
      setParty({ queue, partyOwner, partyId })
    })

    socket.on('party:player-left', ({ player }) => {
      alert("aviso de jugador fuera")
      //leaveParty()
    })

    socket.on('queue:updated', ({ status, startedAt, estimatedTime }) => {
      setQueueStatus({ status, startedAt, estimatedTime })
    })

    return () => {
      socket.off('party:set');
      socket.off('queue:updated')
    }
  }, [socket])

}
