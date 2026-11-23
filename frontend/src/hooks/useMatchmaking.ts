import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setQueueStatus, setQueue, setParty, leaveParty } from "@/redux/slices/matchmakingSlice";
import { useSocketContext } from '@/socket/SocketContext';
import type { Queue, QueueStatus } from '@/types/ui'

export function useMatchmaking() {
  const dispatch = useAppDispatch();
  const matchmaking = useAppSelector((state) => state.matchmaking);
  const socket = useSocketContext()

  const createParty = ({ queue }: {queue: Queue}) => {
    if (!socket) return;
    socket.emit("party:create", { queue })
  }

  const quitParty = () => {
    dispatch(leaveParty())
    if (!socket) return;
    socket.emit('party:leave')
  }

  const findMatch = ({ partyId }: { partyId: string }) => {
    if(!socket) return
    socket.emit('queue:start', { partyId })
  }

  const cancelFindMatch = ({ partyId }: { partyId: string }) => {
    if(!socket) return
    socket.emit('queue:cancel', { partyId })
  }

  return {
    ...matchmaking,
    matchmaking,

    setQueue: (payload: Queue) => dispatch(setQueue(payload)),
    setQueueStatus: (payload: { status: QueueStatus; startedAt: number; estimatedTime: number }) => dispatch(setQueueStatus(payload)),
    setParty: (payload: { partyId: string; partyOwner: string; queue: string }) => dispatch(setParty(payload)),

    quitParty,
    createParty,
    findMatch,
    cancelFindMatch
  };
}
