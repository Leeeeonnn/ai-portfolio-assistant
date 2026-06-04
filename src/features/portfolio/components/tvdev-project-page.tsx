import { ProjectRelatedSection } from "@/features/portfolio/components/project-related-section";
import { SiteHeader } from "@/features/portfolio/components/site-header";

const tvdevSections = [
  {
    alt: "TvDev 项目展示 1",
    src: "/figma-assets/tvdev/section-1.png",
  },
  {
    alt: "TvDev 项目展示 2",
    src: "/figma-assets/tvdev/section-2.png",
  },
  {
    alt: "TvDev 项目展示 3",
    src: "/figma-assets/tvdev/section-3.png",
  },
  {
    alt: "TvDev 项目展示 4",
    src: "/figma-assets/tvdev/section-4.png",
  },
  {
    alt: "TvDev 项目展示 5",
    src: "/figma-assets/tvdev/section-5.png",
  },
];

export function TvdevProjectPage() {
  return (
    <main className="tokenview-static-page" data-node-id="807:56">
      <SiteHeader className="project-white-header" />
      <div className="tokenview-static-body">
        {tvdevSections.map((section) => (
          <img
            alt={section.alt}
            className="tokenview-static-image"
            key={section.src}
            src={section.src}
          />
        ))}
      </div>
      <ProjectRelatedSection
        currentHref="/projects/tvdev"
        logoFrame
        logoFramePaddingTop={0}
        logoHeight={50}
        logoSrc="/figma-assets/tvdev/bottom-logo.svg"
        logoWidth={155.193}
      />
    </main>
  );
}
