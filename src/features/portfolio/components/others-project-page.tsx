import { ProjectRelatedSection } from "@/features/portfolio/components/project-related-section";
import { SiteHeader } from "@/features/portfolio/components/site-header";

const othersSections = Array.from({ length: 10 }, (_, index) => ({
  alt: `Others 项目展示 ${index + 1}`,
  src: `/figma-assets/others/section-${index + 1}.png`,
}));

export function OthersProjectPage() {
  return (
    <main className="tokenview-static-page" data-node-id="827:218">
      <SiteHeader className="project-white-header" />
      <div className="tokenview-static-body">
        {othersSections.map((section) => (
          <img
            alt={section.alt}
            className="tokenview-static-image"
            key={section.src}
            src={section.src}
          />
        ))}
      </div>
      <ProjectRelatedSection currentHref="/projects/others" />
    </main>
  );
}
