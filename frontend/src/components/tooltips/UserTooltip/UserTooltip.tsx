"use client";

import "./UserTooltip.css";
import { useRef } from "react";
import Image from "next/image";
import { RESOURCES_URL } from '@/utils/constants'
import type { ConnectedUser } from "@/types/user"

interface UserTooltipProps {
  hoveredUser: ConnectedUser,
  tooltipPos: { x: number, y: number }
}

export const UserTooltip = ({ hoveredUser, tooltipPos }: UserTooltipProps) => {
  const {
    profile_icon,
    alias,
    tag,
    rank,
    profile_border,
    profile_background,
    title
  } = hoveredUser
  const ref = useRef<HTMLDivElement | null>(null);



  const getRem = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const currentRem = getRem();

  const tooltipHeight = 28.8 * currentRem;
  const margin = currentRem;
  const centeredTop = tooltipPos.y - tooltipHeight / 2;
  const maxTop = Math.max(margin, window.innerHeight - tooltipHeight - margin);
  const top = Math.min(Math.max(margin, centeredTop), maxTop);

  const style = {
    position: "fixed",
    display: `${hoveredUser ? "flex" : "none"}`,
    right: Math.round(tooltipPos.x + currentRem * 2),
    top: Math.round(top),
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url('${RESOURCES_URL}/champion/centered/${profile_background}.jpg')`,
    pointerEvents: "none",
  } satisfies React.CSSProperties;

  return (
    <div className="right-nav-user-tooltip" style={style} ref={ref}>
      <div className="tooltip-user-container">
        <div className="tooltip-user-level">
          <Image
            src={`${RESOURCES_URL}/general/7201_Precision.png`}
            width={30}
            height={30}
            alt="Precision icon"
          />
          <h3>24</h3>
        </div>
        <div className="tooltip-user-info">
          <div className="tooltip-user-icon">
            <img
              className="tooltip-user-border"
              src={`/profile-borders/${profile_border || "theme-17-border"}.png`}
            />
            <Image
              className="tooltip-user-icon-img"
              src={`${RESOURCES_URL}/profileicon/${profile_icon}.png`}
              width={100}
              height={100}
              alt="Profile icon"
            />
          </div>
          <div className="tooltip-user-info-text">
            <h4>{alias}</h4>
            <h6 className="subname">#{tag}</h6>
            <span className="user-title">{title}</span>
            <div className="separator" />
            <span className="rank-and-points">
              {rank?.name} ({rank?.points} pts)
            </span>
          </div>
        </div>
        <div className="tooltip-user-status">
          <div className="user-status">
            <div
              style={{ width: "10px", height: "10px" }}
              className="status-icon"
            ></div>{" "}
            Online{" "}
          </div>
        </div>
      </div>
    </div>
  );

};

export default UserTooltip;
