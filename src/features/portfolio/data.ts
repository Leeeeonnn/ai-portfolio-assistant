export type ToolItem = {
  label: string;
  src: string;
};

export type FeatureAction =
  | {
      type: "portfolio";
    }
  | {
      type: "resume";
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
  buttonIconSrc: string;
  iconSrc: string;
  iconClassName?: string;
  action: FeatureAction;
};

export type PortfolioProject = {
  title: string;
  imageSrc: string;
  href: string;
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
  chatLoading: "/figma-assets/chat-loading.png",
  contactQr: "/figma-assets/contact-qr.png",
  contactAvatar: "/figma-assets/contact-avatar.png",
  portfolioButtonIcon: "/figma-assets/Portfolioiocn.png",
  resumeButtonIcon: "/figma-assets/Resumeiconicon.png",
  contactButtonIcon: "/figma-assets/Contactmeicon.png",
  aboutButtonIcon: "/figma-assets/Aboutwebsite.png",
  downloadIcon: "/figma-assets/download.png",
  contactLooks: [
    "/figma-assets/contact-look-1.png",
    "/figma-assets/contact-look-2.png",
    "/figma-assets/contact-look-3.png",
    "/figma-assets/contact-look-4.png",
    "/figma-assets/contact-look-5.png",
    "/figma-assets/contact-look-6.png",
    "/figma-assets/contact-look-7.png",
    "/figma-assets/contact-look-8.png",
    "/figma-assets/contact-look-9.png",
  ],
  projectAskbot: "/figma-assets/project-askbot.png",
  projectTokenview: "/figma-assets/project-tokenview.png",
  projectMixpay: "/figma-assets/project-mixpay.png",
  projectDeveloper: "/figma-assets/project-developer.png",
  projectChainseye: "/figma-assets/project-chainseye.png",
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
    buttonLabel: "作品集",
    buttonIconSrc: figmaAssets.portfolioButtonIcon,
    iconSrc: figmaAssets.portfolioIcon,
    action: {
      type: "portfolio",
    },
  },
  {
    title: "下载简历",
    buttonLabel: "简历",
    buttonIconSrc: figmaAssets.resumeButtonIcon,
    iconSrc: figmaAssets.resumeIcon,
    action: {
      type: "resume",
      href: "/files/resume.pdf",
    },
  },
  {
    title: "联系我",
    buttonLabel: "联系我",
    buttonIconSrc: figmaAssets.contactButtonIcon,
    iconSrc: figmaAssets.meIcon,
    iconClassName: "portfolio-card-icon-me",
    action: {
      type: "contact",
    },
  },
  {
    title: "关于网站",
    buttonLabel: "关于网站",
    buttonIconSrc: figmaAssets.aboutButtonIcon,
    iconSrc: figmaAssets.websiteIcon,
    iconClassName: "portfolio-card-icon-website",
    action: {
      type: "about",
    },
  },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "AskBOT",
    imageSrc: figmaAssets.projectAskbot,
    href: "/projects/askbot",
  },
  {
    title: "Tokenview",
    imageSrc: figmaAssets.projectTokenview,
    href: "/projects/tokenview",
  },
  {
    title: "Mixpay",
    imageSrc: figmaAssets.projectMixpay,
    href: "/projects/mixpay",
  },
  {
    title: "Developer",
    imageSrc: figmaAssets.projectDeveloper,
    href: "/projects/developer",
  },
  {
    title: "Chainseye",
    imageSrc: figmaAssets.projectChainseye,
    href: "/projects/chainseye",
  },
];

export const presetQuestions = [
  "先做个自我介绍吧",
  "讲一下在数巅的工作经历吧",
  "这个网站是怎么做的？",
];
