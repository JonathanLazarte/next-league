import { useDispatch, useSelector } from 'react-redux'
import { setTooltip, hideTooltip, selectTooltipData } from '@/redux/slices/tooltipSlice'
import type { ConnectedUser } from '@/types/user'

type SetTooltipPayload =
  | { type?: "text"; position: { x: number; y: number }; content: string }
  | { type: "user"; position: { x: number; y: number }; content: ConnectedUser }

export function useTooltip() {
  const dispatch = useDispatch()
  const tooltip = useSelector(selectTooltipData)

  const handleSet = (payload: SetTooltipPayload) => dispatch(setTooltip(payload))

  const handleHide = () => dispatch(hideTooltip())

  return {
    ...tooltip,
    set: handleSet,
    hide: handleHide
  }
}
