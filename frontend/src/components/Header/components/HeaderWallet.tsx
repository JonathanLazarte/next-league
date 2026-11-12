import { useUser } from '@/hooks/useUser'
import type { TooltipTrigger } from '@/types/ui';

interface HeaderWalletProps {
  trigger: TooltipTrigger,
}

export default function HeaderWallet({ trigger }: HeaderWalletProps) {
  const { RP, BE } = useUser()

  return (<>
    <div className="account-coins">
      <div {...trigger({ content: `${RP?.toLocaleString('es-AR')} RP` })} className="riot-points">
        <img src="/general/RP_icon.png" alt="RP" />
        <div className="RP">
          {RP > 10000
            ? `${Math.floor(RP / 1000)} K`
            : RP || 0}
        </div>
        <div className="header-buy-rp-button">
          <div className="buy-rp-icon">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="5" y1="1.5" x2="5" y2="8.5" />
              <line x1="1.5" y1="5" x2="8.5" y2="5" />
            </svg>
          </div>
        </div>
      </div>
      <div {...trigger({ content: `${BE?.toLocaleString('es-AR')} Blue essences` })} className="blue-essences">
        <img src="/general/BE_icon.png" alt="BE" />
        <div className="BE">
          {BE > 10000
            ? `${Math.floor(BE / 1000)} K`
            : BE || 0}
        </div>
      </div>
    </div>
  </>)
}
