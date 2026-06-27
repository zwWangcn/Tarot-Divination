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
    headerTitle: "古铜神喻",
    headerBadge: "双子星 AI 连结",
    promptHeading: "开启古铜神喻",
    promptSub: "静心冥想，在古老铜版画卷上刻下你迫切追寻的命运困惑与奥秘。",
    promptPlaceholder: "输入你想咨询的问题，例如：‘我三个月内能拿到满意的offer吗，阻碍和突破口在哪里？’",
    suggestedPromptsLabel: "启示之问模版：",
    startBtn: "开启神谕雕琢",
    yourQuery: "您的问题：",
    editQueryBtn: "修改问题",
    selectCardsHeading: "镌刻 3 张命运印记",
    selectCardsSub: "深呼吸，在下方 12 张覆盖的铜版纸牌中，点击挑选指代你过去、现在、未来的 3 张牌。",
    past: "过去 (Past)",
    present: "现在 (Present)",
    future: "未来 (Future)",
    consultBtn: "拓印群星启示",
    revelationHeading: "铜板拓印 · 命运显现",
    revelationSub: "您占卜的问题是：",
    clickUnveil: "点击卡牌，揭示其神秘面容",
    errorHeading: "命运之轴偏离",
    realignBtn: "重新注入神识",
    codexHeader: "命运拓印本 · 启示书",
    restartBtn: "重启古铜占卜",
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
    headerTitle: "CHALCOGRAPHY ORACLE",
    headerBadge: "GEMINI AI INTEGRATION",
    promptHeading: "Begin Chalcography Oracle",
    promptSub: "In quiet contemplation, etch your deepest queries onto the ancient copper plates of destiny.",
    promptPlaceholder: "State your question, e.g., 'Will I receive a satisfying career offer in the next three months? What are the blocks and breakthroughs?'",
    suggestedPromptsLabel: "Suggested Queries:",
    startBtn: "Etch the Destiny Plate",
    yourQuery: "Your Query:",
    editQueryBtn: "Modify Question",
    selectCardsHeading: "Select Three Sacred Engravings",
    selectCardsSub: "Take a deep breath and select three copperplates representing your Past, Present, and Future.",
    past: "Past",
    present: "Present",
    future: "Future",
    consultBtn: "Print the Revelations",
    revelationHeading: "The Engraved Revelations of Fate",
    revelationSub: "Your queried mystery:",
    clickUnveil: "Click cards to unveil their mysterious etchings",
    errorHeading: "The Axis of Fate Has Shifted",
    realignBtn: "Re-align Spiritual Force",
    codexHeader: "Archival Codex · Revelation",
    restartBtn: "Re-commence Rite",
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
    headerTitle: "古典銅版の神託",
    headerBadge: "GEMINI AI 連携",
    promptHeading: "古典銅版の神託を開く",
    promptSub: "心を静め、天球儀に刻み込むように、あなたが追求する魂の問いを星に語りかけてください。",
    promptPlaceholder: "占いたい問いを入力（例：3ヶ月以内に満足のいく内定を獲得できますか？障害と突破口はどこにありますか？）",
    suggestedPromptsLabel: "啓示テンプレート：",
    startBtn: "神託の彫刻を始める",
    yourQuery: "あなたの問い：",
    editQueryBtn: "質問を編集",
    selectCardsHeading: "3枚の運命の刻印を選ぶ",
    selectCardsSub: "深呼吸をし、伏せられた12枚の銅版カードから、過去、現在、未来を指し示す3枚を選択してください。",
    past: "過去 (Past)",
    present: "現在 (Present)",
    future: "未来 (Future)",
    consultBtn: "星々の啓示を刷る",
    revelationHeading: "銅版画の顕現 · 運命の刻印",
    revelationSub: "ご質問：",
    clickUnveil: "カードをクリックして神秘的な真姿を解読します",
    errorHeading: "運命の軌跡が偏向しました",
    realignBtn: "再び精神を同調する",
    codexHeader: "啓示の古書巻 · 神託書",
    restartBtn: "古典占儀を再開",
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
