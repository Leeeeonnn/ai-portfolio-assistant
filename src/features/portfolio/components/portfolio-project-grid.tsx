"use client";

import type { PortfolioProject } from "@/features/portfolio/data";

type PortfolioProjectGridProps = {
  onProjectClick?: () => void;
  projects: PortfolioProject[];
};

export function PortfolioProjectGrid({
  onProjectClick,
  projects,
}: PortfolioProjectGridProps) {
  return (
    <div className="figma-portfolio-projects" data-node-id="339:18">
      {projects.map((project) => (
        <a
          className="figma-portfolio-project"
          href={project.href}
          key={project.title}
          onClick={onProjectClick}
        >
          <img alt="" height={104} src={project.imageSrc} width={96} />
          <span>{project.title}</span>
        </a>
      ))}
    </div>
  );
}
