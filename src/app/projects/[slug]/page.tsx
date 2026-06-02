import Link from "next/link";
import { notFound } from "next/navigation";
import { portfolioProjects } from "@/features/portfolio/data";
import { SiteHeader } from "@/features/portfolio/components/site-header";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({
    slug: project.href.split("/").at(-1) ?? "",
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = portfolioProjects.find(
    (item) => item.href === `/projects/${slug}`,
  );

  if (!project) {
    notFound();
  }

  return (
    <main className="figma-page figma-project-page">
      <SiteHeader />
      <section className="figma-project-placeholder">
        <img alt="" height={104} src={project.imageSrc} width={96} />
        <h1>{project.title}</h1>
        <p>项目详情页待补充设计稿。</p>
        <Link href="/">返回首页</Link>
      </section>
    </main>
  );
}
