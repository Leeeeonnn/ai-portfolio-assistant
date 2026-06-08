"use client";

import Link from "next/link";
import { figmaAssets } from "@/features/portfolio/data";
import { trackEvent } from "@/features/analytics/umami";

export function PortfolioPdfLink() {
  return (
    <a
      className="askbot-pdf-button"
      href="/files/portfolio.pdf"
      onClick={() => trackEvent("download_portfolio", { source: "project_related" })}
      rel="noreferrer"
      target="_blank"
    >
      <img alt="" src={figmaAssets.downloadIcon} />
      下载 PDF
    </a>
  );
}

export function BackHomeLink() {
  return (
    <Link
      className="askbot-home-button"
      href="/"
      onClick={() => trackEvent("back_home_from_project")}
    >
      回到首页
      <img
        alt=""
        className="askbot-home-button-icon"
        src={figmaAssets.backHomeIcon}
      />
    </Link>
  );
}
