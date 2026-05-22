export type ToolItem = {
  label: string;
  src: string;
};

export type FeatureAction =
  | {
      type: "download";
      href: string;
    }
  | {
      type: "contact";
    }
  | {
      type: "about";
    };

export type FeatureCard = {
  title: string;
  buttonLabel: string;
  iconSrc: string;
  iconClassName?: string;
  action: FeatureAction;
};

export const figmaAssets = {
  logo: "/figma-assets/logo.png",
  figma: "/figma-assets/figma.png",
  codex: "/figma-assets/codex.png",
  qwen: "/figma-assets/qwen.png",
  chatgpt: "/figma-assets/chatgpt.png",
  dify: "/figma-assets/dify.png",
  portfolioIcon: "/figma-assets/portfolio-icon.png",
  resumeIcon: "/figma-assets/resume-icon.png",
  meIcon: "/figma-assets/me-icon.png",
  websiteIcon: "/figma-assets/website-icon.png",
  send: "/figma-assets/send.png",
  loadingWave: "/figma-assets/loading-wave.png",
  contactQr: "/figma-assets/contact-qr.png",
  contactAvatar: "/figma-assets/contact-avatar.png",
};

export const tools: ToolItem[] = [
  { label: "Figma", src: figmaAssets.figma },
  { label: "Codex", src: figmaAssets.codex },
  { label: "Qwen", src: figmaAssets.qwen },
  { label: "ChatGPT", src: figmaAssets.chatgpt },
  { label: "Dify", src: figmaAssets.dify },
];

export const featureCards: FeatureCard[] = [
  {
    title: "下载作品集",
    buttonLabel: "下载作品集",
    iconSrc: figmaAssets.portfolioIcon,
    action: {
      type: "download",
      href: "/files/portfolio.pdf",
    },
  },
  {
    title: "下载简历",
    buttonLabel: "下载简历",
    iconSrc: figmaAssets.resumeIcon,
    action: {
      type: "download",
      href: "/files/resume.pdf",
    },
  },
  {
    title: "联系我",
    buttonLabel: "联系我",
    iconSrc: figmaAssets.meIcon,
    iconClassName: "portfolio-card-icon-me",
    action: {
      type: "contact",
    },
  },
  {
    title: "关于网站",
    buttonLabel: "关于网站",
    iconSrc: figmaAssets.websiteIcon,
    iconClassName: "portfolio-card-icon-website",
    action: {
      type: "about",
    },
  },
];

export const presetQuestions = [
  "先做个自我介绍吧",
  "讲一下在数巅的工作经历吧",
  "这个网站是怎么做的？",
];
