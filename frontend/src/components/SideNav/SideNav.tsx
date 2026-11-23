"use client"

import "./SideNav.css";
import { useState, memo } from "react";



import { RiFilePaper2Fill } from "react-icons/ri";
import { MdBugReport } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa6";
import { IoChatboxSharp } from "react-icons/io5";

import ProfileBox from "./ProfileBox";
import PartyPanel from "./PartyPanel"
import SocialPanel from "./SocialPanel";



import { useUserInterface } from "@/hooks/useUserInterface";
import { useChat } from "@/hooks/useChat";
import ReportBugModal from "@/components/ReportBugModal/ReportBugModal";


export default memo(function RightNav() {
  const { actualSection, userState, showSideNav, updateSideNav } = useUserInterface();
  const [isReportBugOpen, setIsReportBugOpen] = useState(false);



  const {
    unreadCount,
    isChatVisible,
    toggleChatVisibility,
  } = useChat();





  const handleChatButtonClick = () => {
    toggleChatVisibility();
  };

  return (
    <>
      <div
      style={{
        right: `${!showSideNav ? "-260px" : "0"}`,
      }}
      className={`sidenav ${actualSection === 'store' || actualSection === 'play' ? "in-store" : ""}`}
    >
      <ProfileBox updateSideNav={updateSideNav} userState={userState} />
      <PartyPanel></PartyPanel>
      <SocialPanel></SocialPanel>

      <div className="right-nav-buttom-buttons">
        <button
          onClick={handleChatButtonClick}
          className={`right-nav-buttom-button ${isChatVisible && "active-button"}`}
        >
          <IoChatboxSharp />
          {unreadCount > 0 && (
            <span className="unread-count-badge">{unreadCount}</span>
          )}
        </button>
        <button className="right-nav-buttom-button news-button not-available" disabled aria-label="News unavailable">
          <RiFilePaper2Fill />
        </button>
        <button className="right-nav-buttom-button not-available" disabled aria-label="Voice unavailable">
          <FaMicrophone />
        </button>
        <span className="actual-version">1.1</span>
        <button className="right-nav-buttom-button bug-report-button" onClick={() => setIsReportBugOpen(true)} aria-label="Report a bug">
          <MdBugReport />
        </button>
      </div>
      </div>
      <ReportBugModal open={isReportBugOpen} onClose={() => setIsReportBugOpen(false)} />
    </>
  );
});
