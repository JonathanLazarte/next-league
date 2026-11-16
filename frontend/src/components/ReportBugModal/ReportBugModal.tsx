"use client";

import { FormEvent, useState } from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import { useI18n } from "@/hooks/useI18n";
import "./ReportBugModal.css";

interface ReportBugModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportBugModal({ open, onClose }: ReportBugModalProps) {
  const { t } = useI18n();
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const close = () => {
    setComment("");
    setSent(false);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = comment.trim();
    if (!message) return;

    const key = "next-league:bug-reports";
    const reports = JSON.parse(localStorage.getItem(key) ?? "[]") as { message: string; createdAt: string }[];
    reports.push({ message, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(reports));
    setComment("");
    setSent(true);
  };

  if (!open || typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="bug-report-modal" role="presentation" onMouseDown={close}>
      <form className="bug-report-panel" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <header className="bug-report-header">
          <div>
            <span className="bug-report-kicker">{t("report.kicker")}</span>
            <h2>{t("report.title")}</h2>
          </div>
          <button type="button" className="bug-report-close" onClick={close} aria-label={t("common.close")}>
            <IoClose />
          </button>
        </header>
        <p className="bug-report-description">{t("report.description")}</p>
        <textarea
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setSent(false);
          }}
          placeholder={t("report.placeholder")}
          aria-label={t("report.placeholder")}
          maxLength={1000}
        />
        {sent && <p className="bug-report-success" role="status">{t("report.saved")}</p>}
        <footer className="bug-report-actions">
          <button type="submit" className="general-button bug-report-submit" disabled={!comment.trim()}>{t("report.send")}</button>
        </footer>
      </form>
    </div>,
    document.body,
  );
}
