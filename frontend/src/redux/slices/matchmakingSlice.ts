import { Queue, QueueStatus } from '@/types/ui';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PartyMember {
  userId: string;
  userName: string;
  alias: string;
  profile_icon: number;
  status: "online" | "away" | "busy" | "offline";
  lastSeen?: number;
  isTyping?: boolean;
  unreadCount: number;
  tag: string;
}

export interface MatchmakingState {
  partyId: string | null;
  partyMembers: PartyMember[] | null;

  queue: string | null;
  queueStatus: QueueStatus;
  queueStartedAt: number | null;
  estimatedQueueTime: number;

}

const initialState: MatchmakingState = {
  partyId: null,
  queue: null,
  queueStatus: 'idle',
  partyMembers: null,

  queueStartedAt: null,
  estimatedQueueTime: 0,

};

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    setParty: (state, action: PayloadAction<{ partyId: string, queue: string, partyOwner: PartyMember}>) => {
      state.partyId = action.payload.partyId;
      state.queue = action.payload.queue;
      state.partyMembers = [action.payload.partyOwner]
    },
    setQueue: (state, action: PayloadAction<Queue>) => {
      state.queue = action.payload;
    },
    setQueueStatus: (state, action: PayloadAction<{ status: QueueStatus; startedAt: number; estimatedTime: number }>) => {
      state.queueStatus = action.payload.status;
      state.queueStartedAt = action.payload.startedAt;
      state.estimatedQueueTime = action.payload.estimatedTime
    },
    setPartyMembers: (state, action: PayloadAction<PartyMember>) => {
      if (!state.partyMembers) {
        state.partyMembers = [action.payload]
      } else {
        state.partyMembers.push(action.payload)
      }
    },
    leaveParty: (state) => {
      state.partyId = null;
      state.queue = null;
    }
  },
});

export const { setQueue, setQueueStatus, setParty, setPartyMembers, leaveParty } = matchmakingSlice.actions;
export default matchmakingSlice.reducer;
