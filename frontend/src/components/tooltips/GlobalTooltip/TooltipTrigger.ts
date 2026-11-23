import { useTooltip } from '@/hooks/useTooltip'
import useHoverIntent from '@/hooks/useHoverIntent'

export default function TooltipTrigger() {
  const tooltip = useTooltip()
  const { start, end } = useHoverIntent({
    resetAfter: 250
  })



  const getTriggerProps = ({ content, addOnMouseLeave }: { content: string; addOnMouseLeave: () => void | undefined }) => {

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget.getBoundingClientRect();

      const startAction = () => {
        tooltip.set({
          position: { x: el.left + el.width / 2, y: el.bottom },
          content
        })
      }

      start({ cb: startAction, isTooltipOpened: false })
    }

    const handleMouseLeave = () => {
      if (addOnMouseLeave) addOnMouseLeave()
      end(() => tooltip.hide())
    }

    return {
      onMouseEnter : (e: React.MouseEvent<HTMLDivElement>) => handleMouseEnter(e),
      onMouseLeave : handleMouseLeave
    }
  }

  return getTriggerProps
}
