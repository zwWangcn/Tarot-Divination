export interface TranslationDict {
  headerTitle: string;
  headerBadge: string;
  promptHeading: string;
  promptSub: string;
  promptPlaceholder: string;
  suggestedPromptsLabel: string;
  startBtn: string;
  yourQuery: string;
  editQueryBtn: string;
  selectCardsHeading: string;
  selectCardsSub: string;
  past: string;
  present: string;
  future: string;
  consultBtn: string;
  revelationHeading: string;
  revelationSub: string;
  clickUnveil: string;
  errorHeading: string;
  realignBtn: string;
  codexHeader: string;
  restartBtn: string;
  footerVow: string;
  footerRights: string;
  suggestedPrompts: string[];
}

export const TRANSLATIONS: Record<'zh' | 'en' | 'ja', TranslationDict> = {
  zh: {
    headerTitle: "星尘塔罗",
    headerBadge: "双子星 AI 连结",
    promptHeading: "开启塔罗神谕",
    promptSub: "静心冥想，让当下的问题与宇宙星轨同频，在星空纸牌中寻求命运的智慧指引。",
    promptPlaceholder: "输入你想咨询的问题，例如：‘我三个月内能拿到满意的offer吗，阻碍和突破口在哪里？’",
    suggestedPromptsLabel: "启示之问模版：",
    startBtn: "开启神谕雕琢",
    yourQuery: "您的问题：",
    editQueryBtn: "修改问题",
    selectCardsHeading: "挑选 3 张命运启示",
    selectCardsSub: "深呼吸，在下方 12 张覆面塔罗牌中，凭直觉点击挑选指代你过去、现在、未来的 3 张牌。",
    past: "过去 (Past)",
    present: "现在 (Present)",
    future: "未来 (Future)",
    consultBtn: "开启群星启示",
    revelationHeading: "塔罗神谕 · 命运显现",
    revelationSub: "您占卜的问题是：",
    clickUnveil: "点击卡牌，揭示其神秘面容",
    errorHeading: "命运之轴偏离",
    realignBtn: "重新注入神识",
    codexHeader: "星尘法典 · 启示书",
    restartBtn: "重启塔罗占卜",
    footerVow: "★ UNDER THE SOLEMN VOW OF THE STARFIELD ★",
    footerRights: "Stardust Tarot © 2026. Powered by Google Cloud Run & Gemini API.",
    suggestedPrompts: [
      "我近期的感情与人际关系发展运势如何？",
      "我当前面临的学业/职业挑战，未来的突破契机在哪？",
      "我该如何抉择眼前的重大决定？它会带来什么结果？",
      "我当下的精神状态和内心能量，正给予我怎样的启示？"
    ]
  },
  en: {
    headerTitle: "STARDUST TAROT",
    headerBadge: "GEMINI AI INTEGRATION",
    promptHeading: "Begin Tarot Oracle",
    promptSub: "In quiet contemplation, align your deepest queries with the celestial orbits and seek timeless guidance.",
    promptPlaceholder: "State your question, e.g., 'Will I receive a satisfying career offer in the next three months? What are the blocks and breakthroughs?'",
    suggestedPromptsLabel: "Suggested Queries:",
    startBtn: "Begin Oracle Journey",
    yourQuery: "Your Query:",
    editQueryBtn: "Modify Question",
    selectCardsHeading: "Select Three Sacred Cards",
    selectCardsSub: "Take a deep breath and select three Tarot cards representing your Past, Present, and Future.",
    past: "Past",
    present: "Present",
    future: "Future",
    consultBtn: "Unveil Stellar Revelations",
    revelationHeading: "Tarot Oracle · Fate Revealed",
    revelationSub: "Your queried mystery:",
    clickUnveil: "Click cards to unveil their mysterious etchings",
    errorHeading: "The Axis of Fate Has Shifted",
    realignBtn: "Re-align Spiritual Force",
    codexHeader: "Stardust Codex · Revelation",
    restartBtn: "Re-commence Divination",
    footerVow: "★ UNDER THE SOLEMN VOW OF THE STARFIELD ★",
    footerRights: "Stardust Tarot © 2026. Powered by Google Cloud Run & Gemini API.",
    suggestedPrompts: [
      "How will my romantic relationships develop in the near future?",
      "What are the key breakthroughs for my current career/academic challenges?",
      "How should I approach my current major dilemma, and what is the outcome?",
      "What core message is my subconscious mind communicating to me right now?"
    ]
  },
  ja: {
    headerTitle: "星屑のタロット",
    headerBadge: "GEMINI AI 連携",
    promptHeading: "タロットの神託を開く",
    promptSub: "心を静め、天球の運行に問いかけを同調させ、神秘的なカードから大いなる導きを得ましょう。",
    promptPlaceholder: "占いたい問いを入力（例：3ヶ月以内に満足のいく内定を獲得できますか？障害と突破口はどこにありますか？）",
    suggestedPromptsLabel: "啓示テンプレート：",
    startBtn: "神託の旅を始める",
    yourQuery: "あなたの問い：",
    editQueryBtn: "質問を編集",
    selectCardsHeading: "3枚のタロットを選択する",
    selectCardsSub: "深呼吸をし、伏せられた12枚のカードから、過去、現在、未来を指し示す3枚を選んでください。",
    past: "過去 (Past)",
    present: "現在 (Present)",
    future: "未来 (Future)",
    consultBtn: "星々の啓示を開く",
    revelationHeading: "タロットの神託 · 運命の顕現",
    revelationSub: "ご質問：",
    clickUnveil: "カードをクリックして神秘的な真姿を解読します",
    errorHeading: "運命の軌跡が偏向しました",
    realignBtn: "再び精神を同調する",
    codexHeader: "星屑の書巻 · 啓示書",
    restartBtn: "タロット占儀を再開",
    footerVow: "★ UNDER THE SOLEMN VOW OF THE STARFIELD ★",
    footerRights: "Stardust Tarot © 2026. Powered by Google Cloud Run & Gemini API.",
    suggestedPrompts: [
      "近い将来、私の恋愛運や人間関係はどのように発展しますか？",
      "現在直面している学業・キャリアの課題と、未来のブレイクスルーは？",
      "目の前の重大な決断をどう下すべきか、その行く末はどうなりますか？",
      "現在の私の精神状態と潜在エネルギーは、どのような啓示を告げていますか？"
    ]
  }
};
