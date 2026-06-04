import { TextType } from "@/components/react-bits/text-type";
import { figmaAssets } from "@/features/portfolio/data";
import { ProjectRelatedSection } from "@/features/portfolio/components/project-related-section";
import { SiteHeader } from "@/features/portfolio/components/site-header";

const heroQuestions = [
  "把今天的门店日报发送至经理群",
  "东南大区这个季度的业绩怎么样",
  "帮我算一下公司这个月的利润同比增长了多少",
];

const painPoints = [
  {
    title: "输入感知",
    items: ["我不知道该问什么？", "这样问 AI 能看懂吗？", "这个系统能查哪些数据？"],
  },
  {
    title: "问题理解",
    items: [
      "“最近销量最好”里的“最近”是几天？",
      "“销量”指销售额还是订单量？",
      "“华北”是否包含北京？",
    ],
  },
  {
    title: "确认与纠错",
    items: [
      "我只是想改一下时间，不想重新输入。",
      "为什么不能直接修改条件？",
      "AI 理解错了，但我不知道怎么纠正它。",
    ],
  },
  {
    title: "结果展示",
    items: ["重点是什么？我只是想快速知道结果。", "为什么没有结论？", "数据太多了，为什么没有图表？"],
  },
  {
    title: "数据解释",
    items: [
      "这个指标怎么算的？数据来源是什么？",
      "为什么和我之前看到的数据不一样？",
      "这个数是怎么查出来的，准吗?",
    ],
  },
  {
    title: "反馈学习",
    items: [
      "为什么每次都要重新选时间？",
      "希望不要每次问答都得从头解释。",
      "有一些同类型问题每次的结果都犯同样的错。",
    ],
  },
];

const detailSections = [
  {
    title: "输入感知",
    body:
      "痛点：用户在进入系统时，往往不知道系统能做什么，也不知道应该如何组织问题表达，本质上是用户缺乏提问心智与系统能力边界认知。\n\n解决：输入感知层的核心体验目标，是在用户正式提交问题前，帮助用户降低提问成本、明确分析意图，并尽可能减少无效输入、歧义表达和错误表达，从源头提升 NL2SQL 的生成准确率。",
    image: "/figma-assets/askbot/input.png",
    imageAlt: "AskBOT 输入感知界面",
    notes: [
      {
        title: "预设/常用问题",
        text:
          "示例问题用于解决用户「不知道怎么问」的问题，帮助用户快速理解系统能力，并模仿示例完成第一次提问。",
      },
      {
        title: "推荐问题",
        text:
          "当用户输入部分关键词时，系统可以根据业务指标、维度、时间范围和历史查询习惯，预测可能的问题，提高输入效率。",
      },
    ],
  },
  {
    title: "问题理解",
    body:
      "痛点：用户担心 AI 是否真正理解了自己的问题，尤其在自然语言中，同一句话可能存在大量歧义，AI 的理解过程不可见会导致用户无法验证模型意图。\n\n解决：问题理解层的核心目标，是将用户模糊、口语化、存在歧义的自然语言问题，逐步转化为结构化、可确认、可执行的数据分析意图。",
    followup: {
      title: "确认与纠错",
      body:
        "痛点：当 AI 理解错误时，传统 AI 问答产品通常只能“重新提问”，用户需要反复修改或追加自然语言表述，沟通成本非常高。\n\n解决：AskBOT 支持对提参过程快捷修改，帮助用户快速调整分析条件与查询范围，减少重复输入与多轮沟通成本，从而提升查数效率与整体使用体验。",
    },
    image: "/figma-assets/askbot/understanding.png",
    imageAlt: "AskBOT 问题理解界面",
    notes: [
      {
        title: "思考过程白盒化",
        text:
          "以流式状态展示 AI 当前的分析过程，通过将模型思考、Agent 决策、工具调用、文档召回、执行状态等关键过程适度透明化。",
      },
      {
        title: "增强关键参数外显",
        text:
          "帮助用户更直观地理解 AI 当前的分析范围、筛选条件与执行逻辑，降低模型黑盒化带来的不确定感。",
      },
    ],
  },
  {
    title: "结果展示",
    body:
      "痛点：虽然成功生成了 SQL，但结果展示仍然停留在“纯表格输出”，用户很难快速获取真正有价值的信息。\n\n解决：采用 Markdown + HTML 混合渲染方案，兼顾 AI 内容生成的稳定性与 BI 场景下的数据可视化、交互操作能力。",
    image: "/figma-assets/askbot/result.png",
    imageAlt: "AskBOT 结果展示界面",
    notes: [
      {
        title: "HTML",
        text: "HTML 拥有更强的表现力与交互能力，使 AI 回答不仅能够展示内容，还能够承载简单的数据分析工作。",
      },
      {
        title: "Markdown",
        text:
          "轻量、结构清晰，非常适合承载 AI 生成的文本内容，能够快速将复杂的数据分析结果结构化呈现。",
      },
    ],
  },
  {
    title: "反馈学习",
    body:
      "痛点：用户会发现系统长期“记不住”自己的习惯与偏好，每次都像第一次使用，系统缺乏持续学习进化机制。\n\n解决：通过用户反馈与行为学习机制，持续优化模型理解能力与个性化推荐能力，提升问答准确率与长期使用体验。",
    image: "/figma-assets/askbot/feedback.png",
    imageAlt: "AskBOT 反馈学习界面",
    notes: [
      {
        title: "点赞/点踩",
        text: "通过点赞/点踩反馈等信息，建立用户偏好模型。",
      },
    ],
  },
];

export function AskbotProjectPage() {
  return (
    <main className="askbot-html-page" data-node-id="661:723">
      <SiteHeader />

      <section className="askbot-hero">
        <svg
          aria-hidden="true"
          className="askbot-hero-wave"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1621.38 546.457"
        >
          <path
            d="M16.8614 527.999C257.011 308.619 629.941 8.54009 682.54 345.39C749.361 773.315 1470.4 4.47945 1617.86 25.4203"
            opacity="0.1"
            stroke="url(#askbotHeroWaveGradient)"
            strokeWidth="50"
            vectorEffect="non-scaling-stroke"
          />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="askbotHeroWaveGradient"
              x1="1617.86"
              x2="16.8614"
              y1="276.499"
              y2="276.499"
            >
              <stop stopColor="#15F5BA" />
              <stop offset="1" stopColor="#6A58EC" />
            </linearGradient>
          </defs>
        </svg>
        <div className="askbot-hero-copy">
          <div className="askbot-hero-title-group">
            <img alt="" className="askbot-product-logo" src="/figma-assets/askbot/product-logo.svg" />
            <h1>AskBOT、X-Engine</h1>
            <p>
              生成式分析智能体、大模型知识库智能体、有虚拟化数据引擎等核心产品，
              服务于全球 200 余家企业世界 500 强和行业标杆央国企业。
            </p>
          </div>
          <div className="askbot-prompt-pill">
            <TextType className="askbot-prompt-text" texts={heroQuestions} />
            <button aria-label="发送示例问题" type="button">
              <img alt="" src={figmaAssets.send} />
            </button>
          </div>
        </div>
        <div className="askbot-hero-media">
          <img alt="AskBOT 桌面端界面" className="askbot-hero-doc" src="/figma-assets/askbot/hero-doc.png" />
          <img alt="AskBOT 移动端界面" className="askbot-hero-mobile" src="/figma-assets/askbot/hero-mobile.png" />
        </div>
      </section>

      <section className="askbot-build">
        <SectionTitle align="center" title="AskBOT 的搭建" />
        <p className="askbot-center-copy">
          针对问答链路中的各个关键环节，从输入感知、问题理解、确认与纠错、结果展示、数据解释、探索与追问、反馈学习等关键环节进行系统化设计，通过提高过程透明度、用户介入纠错等方式，提升回答准确率，降低大模型幻觉带来的错误信息与输出结果不确定性，从而优化整体用户体验，提高用户信任感。
        </p>
        <img alt="AskBOT 一轮问答完整周期" className="askbot-flow" src="/figma-assets/askbot/flow.png" />
        <p className="askbot-caption">一轮问答的完整周期</p>
      </section>

      <section className="askbot-pain">
        <SectionTitle align="center" title="😵 用户痛点" />
        <p className="askbot-center-copy">
          通过与市场部门同事交流、对客户访谈等方式收集到的用户问题，并加以分析和归类。
        </p>
        <div className="askbot-pain-grid">
          {painPoints.map((point) => (
            <article className="askbot-pain-card" key={point.title}>
              <h3>{point.title}</h3>
              <ul>
                {point.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {detailSections.map((section, index) => (
        <ProjectDetailSection index={index} key={section.title} section={section} />
      ))}

      <section className="askbot-color-section">
        <div className="askbot-color-bars">
          <span />
          <span />
        </div>
        <SectionTitle title="颜色" />
        <img alt="AskBOT 色彩梯度" className="askbot-gradient" src="/figma-assets/askbot/gradient.png" />
        <div className="askbot-color-notes">
          <div>
            <h3>APCA</h3>
            <p>配色通过 APCA 测试，提升界面的可读性与可访问性，确保文字与背景之间具备足够的视觉对比度。</p>
          </div>
          <div>
            <h3>Alpha</h3>
            <p>使用 alpha 梯度色，能够更好地与背景内容融合。</p>
          </div>
        </div>
        <figure className="askbot-palette">
          <img alt="AskBOT 调色盘" src="/figma-assets/askbot/palette.png" />
          <figcaption>Primary-8 的色值</figcaption>
        </figure>
      </section>

      <section className="askbot-other-banner">
        <img alt="" src="/figma-assets/askbot/section-banner.png" />
        <div>
          <h2>其他部分界面展示</h2>
          <span />
          <p>HITL、智能文档、知识库问答等</p>
        </div>
      </section>
      <img
        alt="AskBOT 其它界面组合展示"
        className="askbot-other-screens"
        src="/figma-assets/askbot/other-screens.png"
      />

      <ProjectRelatedSection currentHref="/projects/askbot" logoSrc="/figma-assets/askbot/bottom-logo.svg" />
    </main>
  );
}

function SectionTitle({
  align = "left",
  title,
}: {
  align?: "center" | "left";
  title: string;
}) {
  return (
    <div className={`askbot-section-title askbot-section-title-${align}`}>
      <h2>{title}</h2>
      <span />
    </div>
  );
}

function ProjectDetailSection({
  index,
  section,
}: {
  index: number;
  section: {
    body: string;
    followup?: {
      body: string;
      title: string;
    };
    image: string;
    imageAlt: string;
    notes: Array<{ text: string; title: string }>;
    title: string;
  };
}) {
  return (
    <section className={`askbot-detail askbot-detail-${index}`}>
      <div className="askbot-detail-intro">
        <SectionTitle title={section.title} />
        <p>{section.body}</p>
      </div>
      <div className="askbot-detail-body">
        <img alt={section.imageAlt} className="askbot-detail-image" src={section.image} />
        <div className="askbot-detail-notes">
          {section.notes.map((note) => (
            <article className="askbot-detail-note" key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.text}</p>
            </article>
          ))}
        </div>
      </div>
      {section.followup ? (
        <div className="askbot-detail-followup">
          <SectionTitle title={section.followup.title} />
          <p>{section.followup.body}</p>
        </div>
      ) : null}
    </section>
  );
}
