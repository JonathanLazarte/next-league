'use client'
import { createPortal } from 'react-dom'
import { useTooltip } from '@/hooks/useTooltip'
import TextTooltip from '@/components/tooltips/TextTooltip/TextTooltip'
import UserTooltip from '@/components/tooltips/UserTooltip/UserTooltip'
import type { ConnectedUser } from '@/types/user'

export default function TooltipLayer() {
  const { visible, position, content, type } = useTooltip()

  if (!visible || content == null) return null
  if (typeof window === 'undefined') return null

  if (type === "user") {
    return createPortal(
      <UserTooltip hoveredUser={content as ConnectedUser} tooltipPos={position} />,
      document.body,
    )
  }

  return createPortal(
    <TextTooltip position={position} content={content as string} />,
    document.body,
  )
}
