import type { CSSProperties } from "react";
import { portfolioProjects } from "@/features/portfolio/data";
import { PortfolioProjectGrid } from "@/features/portfolio/components/portfolio-project-grid";
import {
  BackHomeLink,
  PortfolioPdfLink,
} from "@/features/portfolio/components/tracked-project-actions";

type ProjectRelatedSectionProps = {
  currentHref: string;
  logoFrame?: boolean;
  logoFramePaddingBottom?: number;
  logoFramePaddingTop?: number;
  logoHeight?: number;
  logoSrc?: string;
  logoWidth?: number;
};

export function ProjectRelatedSection({
  currentHref,
  logoFrame = false,
  logoFramePaddingBottom = 200,
  logoFramePaddingTop = 100,
  logoHeight,
  logoSrc,
  logoWidth,
}: ProjectRelatedSectionProps) {
  const relatedProjects = portfolioProjects.filter(
    (project) => project.href !== currentHref,
  );
  const logoStyle =
    logoSrc && logoWidth && logoHeight
      ? ({ height: logoHeight, width: logoWidth } as const)
      : undefined;
  const logoFrameStyle = {
    "--project-logo-frame-padding-bottom": `${logoFramePaddingBottom}px`,
    "--project-logo-frame-padding-top": `${logoFramePaddingTop}px`,
  } as CSSProperties;

  return (
    <>
      {logoFrame && logoSrc ? (
        <section className="project-logo-frame" style={logoFrameStyle}>
          <img
            alt=""
            className="askbot-related-logo"
            src={logoSrc}
            style={logoStyle}
          />
        </section>
      ) : null}
      <section
        className={[
          "askbot-related",
          logoFrame ? "askbot-related-with-logo-frame" : null,
          !logoSrc ? "askbot-related-no-logo" : null,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {!logoFrame && logoSrc ? (
          <img
            alt=""
            className="askbot-related-logo"
            src={logoSrc}
            style={logoStyle}
          />
        ) : null}
        <div className="askbot-related-work">
          <h2>看看其他作品</h2>
          <PortfolioProjectGrid projects={relatedProjects} />
          <div className="askbot-related-actions">
            <PortfolioPdfLink />
            <BackHomeLink />
          </div>
        </div>
      </section>
    </>
  );
}
