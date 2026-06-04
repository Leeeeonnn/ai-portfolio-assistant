import Link from "next/link";
import { figmaAssets } from "@/features/portfolio/data";
import { SiteHeader } from "@/features/portfolio/components/site-header";

const aboutSections = [
  {
    title: "第一部分：AI 分身",
    paragraphs: [
      "AI 分身是基于 Dify 搭建的应用，并通过 API 接入到个人作品集网站中。",
      "为了降低模型猜测和幻觉，我为它准备了两类知识材料：一类是结构化后的真实简历，包括个人资料、工作经历、项目经验和技能信息；另一类是人格资料，因为我希望这个 AI 不只是“能回答问题”，还要在表达方式上更接近我本人。",
      "人格资料来自微信聊天记录。原始聊天数据先由 Codex 按规则完成清洗、去噪、标签标注和人格特征提炼，最终整理成人格文档，再接入 Dify 知识库。",
      "在 Dify 中，我对这些资料进行了分段处理，并通过 RAG 的方式进行检索增强生成：用户提问后，系统会先从简历知识库和人格知识库中召回相关内容，再交给模型生成回答。",
      "但实际测试中也发现，因为样本量有限、知识库覆盖不完整，模型在回答边界模糊的问题时仍然会出现较多幻觉。因此后续需要继续补充高质量语料、优化分段方式、调整召回策略，并在 Prompt 中明确要求模型优先基于知识库回答，无法确认时直接说明“不确定”。",
    ],
  },
  {
    title: "第二部分：网站搭建",
    paragraphs: [
      "网站采用 Figma + Codex + Dify + Vercel 的技术方案完成搭建。",
      "我首先在 Figma 中完成页面设计，再通过 Codex 协助完成前端页面开发和功能实现。项目开发过程中，ChatGPT 主要用于方案设计、Prompt 编写和问题排查，Codex 负责代码生成与调试。最终通过 GitHub 进行代码管理，并部署至 Vercel 实现自动发布上线。",
    ],
  },
  {
    title: "一些思考",
    paragraphs: [
      "这个项目本身并不复杂，但它承载了我对于「AI 时代设计师的作品集应该是什么样的」这个问题的思考，也从工程上完整串联了我对 AI 产品的理解与实践。从知识库构建、Prompt 设计，到 AI 交互体验、前端实现和上线部署，我尝试以产品设计师的视角参与整个产品生命周期，而不仅仅停留在界面设计层面。",
      "过去几年，我的工作经历覆盖了 AI 产品、区块链、金融等领域，相比具体的行业经验，我更关注如何理解用户问题、拆解复杂需求，并通过产品设计将技术能力转化为用户价值。",
      "随着 AI 技术的快速演进，设计师的角色正在发生深刻变化，能力边界不断拓宽，许多分工、协作方式也正在被重新定义。设计师的价值不再局限于界面设计和需求执行，而是逐渐向产品共创、体验规划和创新探索延伸。这也是我希望持续学习、实践和成长的方向。",
      "如果您对我的经历或项目感兴趣，欢迎直接与我交流。",
      "谢谢 ^_^",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="about-page" data-node-id="869:265">
      <SiteHeader />
      <span aria-hidden="true" className="about-line about-line-horizontal" />
      <span aria-hidden="true" className="about-line about-line-vertical" />
      <span aria-hidden="true" className="about-line-node" />

      <img
        alt=""
        className="about-head about-head-left"
        height={84}
        src="/figma-assets/about/head-right.png"
        width={84}
      />
      <img
        alt=""
        className="about-head about-head-right"
        height={84}
        src="/figma-assets/about/head-left.png"
        width={84}
      />

      <section className="about-content">
        <h1>关于网站</h1>
        <div className="about-copy">
          <p>
            这是一个从 0 搭建的个人网站，全程由 AI 完成，可以说这个网站本身就是作品集的一部分。
            <br />
            下面我介绍一下这个网站是怎么做的。
          </p>

          {aboutSections.map((section) => (
            <section className="about-copy-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <Link className="about-home-button" href="/">
            回到首页
            <img alt="" height={18} src={figmaAssets.backHomeIcon} width={18} />
          </Link>
        </div>
      </section>

      <img
        alt=""
        className="about-laptop-avatar"
        height={183}
        src="/figma-assets/about/laptop-avatar.png"
        width={153}
      />
    </main>
  );
}
