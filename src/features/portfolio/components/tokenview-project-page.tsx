import { ProjectRelatedSection } from "@/features/portfolio/components/project-related-section";
import { SiteHeader } from "@/features/portfolio/components/site-header";

const tokenviewSections = Array.from({ length: 19 }, (_, index) => ({
  alt: `Tokenview 项目展示 ${index + 1}`,
  src: `/figma-assets/tokenview/section-${index + 1}.png`,
}));

export function TokenviewProjectPage() {
  return (
    <main className="tokenview-static-page" data-node-id="812:106">
      <SiteHeader className="project-white-header" />
      <div className="tokenview-static-body">
        {tokenviewSections.map((section, index) => (
          <div className="tokenview-static-frame" key={section.src}>
            <img
              alt={section.alt}
              className="tokenview-static-image"
              src={section.src}
            />
            {index === 2 ? <span aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
      <ProjectRelatedSection
        currentHref="/projects/tokenview"
        logoFrame
        logoHeight={40}
        logoSrc="/figma-assets/tokenview/bottom-logo.svg"
        logoWidth={278.811}
      />
    </main>
  );
}
