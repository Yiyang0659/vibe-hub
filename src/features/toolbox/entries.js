export const toolEntries = [
  {
    id: "deepseek-harness-sync",
    title: "DeepSeek Harness Sync",
    type: "SCRIPT",
    typeLabel: "配置同步脚本",
    category: "AI 工具",
    date: "2026-09-10",
    publication: "published",
    subtitle: "同步 DSH 配置、插件清单与 Skills，方便跨设备恢复。",
    problemSolved: "减少多台电脑之间重复配置 DeepSeek Harness 环境的工作。",
    usage:
      "按仓库 README 准备 DSH 环境与自己的同步仓库，再选择手动同步或文件监听。新设备通过还原脚本恢复插件，并单独填写凭据。",
    url: "https://github.com/Yiyang0659/deepseek-harness-sync",
    steps: [
      {
        title: "准备环境",
        detail: "阅读 README，检查 DSH、Git 和插件依赖环境。",
      },
      {
        title: "选择同步方式",
        detail:
          "使用 sync-push.bat / sync-pull.bat 手动同步，或通过 sync-watch.bat 监听变更。",
      },
      {
        title: "恢复配置",
        detail: "新设备按照 README 克隆配置并运行 restore.bat，补齐本机凭据。",
      },
    ],
    limitations: [
      "这是配置与脚本仓库，使用前需准备对应运行环境。",
      "凭据应在本机填写；同步和恢复前检查仓库中的忽略规则。",
      "此页依据仓库说明整理，未执行安装或跨设备同步测试。",
    ],
    sourceUrl: "https://github.com/Yiyang0659/deepseek-harness-sync#readme",
    relatedTopics: ["git-workflow", "gitignore"],
  },
  {
    id: "content-publish-checklist",
    title: "一条学习记录的发布检查",
    type: "CHECKLIST",
    typeLabel: "检查清单",
    category: "内容整理",
    date: "2026-09-10",
    publication: "published",
    problemSolved: "发布前确认内容表达清楚、来源明确、相关入口可以使用。",
    whenToUse: "写完一条知识、笔记或工具说明，准备放进网站时。",
    checklist: [
      "标题说清楚一个具体问题。",
      "区分自己的经历、外部引用和假设例子。",
      "检查结论与实际观察是否一致。",
      "来源与相关内容链接可以打开。",
      "在手机上读一遍，确认文字和图片可读。",
    ],
    relatedNotes: ["content-before-expansion"],
    relatedWork: ["learning-site"],
  },
];
