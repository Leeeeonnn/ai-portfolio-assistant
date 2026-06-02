import Link from "next/link";
import { figmaAssets, tools } from "@/features/portfolio/data";

export function SiteHeader() {
  return (
    <header className="portfolio-header" data-node-id="4:97">
      <Link aria-label="回到首页" className="portfolio-logo" href="/">
        <img alt="" height={40} src={figmaAssets.logo} width={116} />
      </Link>

      <nav aria-label="Built with" className="portfolio-tools">
        <span>Built with</span>
        {tools.map((tool) => (
          <img
            alt={tool.label}
            height={26}
            key={tool.label}
            src={tool.src}
            width={26}
          />
        ))}
      </nav>
    </header>
  );
}
