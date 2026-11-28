import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import type { ConnectedUser } from '@/types/user'

export type TooltipType = "text" | "user"
export type TooltipContent = string | ConnectedUser

interface TooltipState {
  visible: boolean,
  type: TooltipType,
  component: string | null,
  anchor: HTMLElement | null,
  position: { x: number, y: number }
  placement: "right" | "left" | "bottom" | "top"
  content: TooltipContent | null,
  options: {
      delay: number;
      interactive: boolean;
  };
}

type SetTooltipPayload =
  | { type?: "text"; position: { x: number; y: number }; content: string }
  | { type: "user"; position: { x: number; y: number }; content: ConnectedUser }

const initialState : TooltipState = {
  visible: false,
  type: "text",
  component: null,
  anchor: null,
  position: { x: 0, y: 0 },
  placement: "bottom",
  content: null,
  options: {
    delay: 300,
    interactive: false
  }

}

const tooltipSlice = createSlice({
  name: 'tooltip',
  initialState,
  reducers: {
    setTooltip: (state, action: PayloadAction<SetTooltipPayload>) => {
      state.type = action.payload.type ?? "text";
      state.position = action.payload.position;
      state.content = action.payload.content;
      state.visible = true;
    },
    hideTooltip: (state) => {
      state.visible = false
    }
  }
})

export const selectTooltipState = (state: { tooltip: TooltipState}) => state.tooltip
export const selectVisible = (state: { tooltip: TooltipState}) => state.tooltip.visible
export const selectAnchor = (state: { tooltip: TooltipState}) => state.tooltip.anchor
export const selectPosition = (state: { tooltip: TooltipState}) => state.tooltip.position
export const selectContent = (state: { tooltip: TooltipState}) => state.tooltip.content
export const selectTooltipType = (state: { tooltip: TooltipState }) => state.tooltip.type

export const selectTooltipData = createSelector(
  [selectVisible, selectAnchor, selectPosition, selectContent, selectTooltipType],
  (visible, anchor, position, content, type) => ({
    visible,
    anchor,
    position,
    content,
    type,
  }),
)

export const { setTooltip, hideTooltip } = tooltipSlice.actions
export default tooltipSlice.reducer
