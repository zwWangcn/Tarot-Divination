import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory reading sessions cache
interface ReadingSession {
  status: "LOADING" | "DONE" | "ERROR";
  request_id: string;
  prompt: string;
  lang: "zh" | "en" | "ja";
  cards: {
    id: string;
    nameEn: string;
    nameZh: string;
    nameJa: string;
    isReversed: boolean;
    position: "past" | "present" | "future";
  }[];
  interpretation?: string;
  error?: string;
  createdAt: number;
}

const sessions = new Map<string, ReadingSession>();

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.log("No valid GEMINI_API_KEY found. Falling back to structured local readings.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Full dataset of Major Arcana keywords to build realistic fallback readings
const cardKeywords: Record<string, {
  nameZh: string; nameEn: string; nameJa: string;
  uprightZh: string; uprightEn: string; uprightJa: string;
  reversedZh: string; reversedEn: string; reversedJa: string;
}> = {
  "0_fool": {
    nameZh: "愚人", nameEn: "The Fool", nameJa: "愚者",
    uprightZh: "自由、新旅程、纯真", uprightEn: "Freedom, New Journeys, Innocence", uprightJa: "自由, 新たな旅, 純粋",
    reversedZh: "鲁莽、盲目、拖延", reversedEn: "Recklessness, Blindness, Delay", reversedJa: "無謀, 盲信, 延期"
  },
  "1_magician": {
    nameZh: "魔术师", nameEn: "The Magician", nameJa: "魔術師",
    uprightZh: "意志力、创造、专注", uprightEn: "Willpower, Creation, Focus", uprightJa: "意志力, 創造, 集中",
    reversedZh: "幻觉、欺骗、能力未显", reversedEn: "Illusions, Deception, Unused Talent", reversedJa: "幻想, 欺瞞, 未開発の才能"
  },
  "2_high_priestess": {
    nameZh: "女祭司", nameEn: "The High Priestess", nameJa: "女教皇",
    uprightZh: "直觉、潜意识、神秘", uprightEn: "Intuition, Subconscious, Mystery", uprightJa: "直感, 潜在意識, 神秘",
    reversedZh: "忽视直觉、肤浅、秘密", reversedEn: "Ignoring Intuition, Superficiality, Secrets", reversedJa: "直感の無視, 浅薄, 秘密"
  },
  "3_empress": {
    nameZh: "女皇", nameEn: "The Empress", nameJa: "女帝",
    uprightZh: "丰饶、母性、自然滋养", uprightEn: "Abundance, Motherhood, Nature", uprightJa: "豊穣, 母性, 自然の育み",
    reversedZh: "依赖、创造力受阻、控制", reversedEn: "Dependence, Blocked Creativity, Control", reversedJa: "依存, 創造性の停滞, 束縛"
  },
  "4_emperor": {
    nameZh: "皇帝", nameEn: "The Emperor", nameJa: "皇帝",
    uprightZh: "权力、秩序、保护", uprightEn: "Authority, Order, Protection", uprightJa: "権威, 秩序, 保護",
    reversedZh: "暴政、纪律涣散、控制", reversedEn: "Tyranny, Lack of Discipline, Rigidity", reversedJa: "暴政, 規律の乱れ, 支配"
  },
  "5_hierophant": {
    nameZh: "教皇", nameEn: "The Hierophant", nameJa: "法王",
    uprightZh: "传统、精神引导、仪式", uprightEn: "Tradition, Spiritual Guidance, Rituals", uprightJa: "伝統, 精神的指導, 儀式",
    reversedZh: "叛逆、教条主义、破旧", reversedEn: "Rebellion, Dogmatism, New Paths", reversedJa: "反逆, 教条主義, 新しい道"
  },
  "6_lovers": {
    nameZh: "恋人", nameEn: "The Lovers", nameJa: "恋人",
    uprightZh: "爱、和谐、重大抉择", uprightEn: "Love, Harmony, Choices", uprightJa: "愛, 調和, 重要な選択",
    reversedZh: "失衡、冲突、不合", reversedEn: "Disharmony, Conflicts, Misalignment", reversedJa: "不調和, 葛藤, 不一致"
  },
  "7_chariot": {
    nameZh: "战车", nameEn: "The Chariot", nameJa: "戦車",
    uprightZh: "意志、胜利、克服障碍", uprightEn: "Willpower, Victory, Control", uprightJa: "意志力, 勝利, 障害の克服",
    reversedZh: "失控、方向迷失、瓶颈", reversedEn: "Loss of Control, Lack of Direction, Blocks", reversedJa: "暴走, 方向性の喪失, 障害"
  },
  "8_strength": {
    nameZh: "力量", nameEn: "Strength", nameJa: "力",
    uprightZh: "勇气、耐力、温柔征服", uprightEn: "Courage, Endurance, Gentle Power", uprightJa: "勇気, 忍耐力, 柔和な力",
    reversedZh: "自我怀疑、软弱、情绪失控", reversedEn: "Self-Doubt, Weakness, Raw Emotion", reversedJa: "自己疑念, 弱気, 感情の暴走"
  },
  "9_hermit": {
    nameZh: "隐士", nameEn: "The Hermit", nameJa: "隠者",
    uprightZh: "内省、独处、寻求真理", uprightEn: "Reflection, Solitude, Truth", uprightJa: "内省, 孤独, 真理の探求",
    reversedZh: "孤独感、偏执封闭、逃避", reversedEn: "Loneliness, Isolation, Withdrawal", reversedJa: "寂しさ, 孤立, 現実逃避"
  },
  "10_wheel_of_fortune": {
    nameZh: "命运之轮", nameEn: "Wheel of Fortune", nameJa: "運命の輪",
    uprightZh: "好运、转变、契机", uprightEn: "Good Luck, Change, Destiny", uprightJa: "幸運, 転換期, 宿命",
    reversedZh: "厄运、阻力、循环不休", reversedEn: "Bad Luck, Resistance to Change, Karma", reversedJa: "不運, 変化への抵抗, 悪循環"
  },
  "11_justice": {
    nameZh: "正义", nameEn: "Justice", nameJa: "正義",
    uprightZh: "公平、真理、承担因果", uprightEn: "Fairness, Truth, Karma", uprightJa: "公平, 真実, カルマ",
    reversedZh: "不公、偏见、推卸责任", reversedEn: "Unfairness, Bias, Lack of Accountability", reversedJa: "不公正, 偏見, 責任転嫁"
  },
  "12_hanged_man": {
    nameZh: "倒吊人", nameEn: "The Hanged Man", nameJa: "吊された男",
    uprightZh: "牺牲、换位思考、暂停", uprightEn: "Sacrifice, New Perspective, Pause", uprightJa: "自己犠牲, 新たな視点, 一時停止",
    reversedZh: "无谓挣扎、拖延、拒绝放手", reversedEn: "Stagnation, Egotism, Resistance", reversedJa: "無駄な抵抗, 停滞, 執着"
  },
  "13_death": {
    nameZh: "死神", nameEn: "Death", nameJa: "死神",
    uprightZh: "结束、断舍离、重生", uprightEn: "Ending, Transformation, Rebirth", uprightJa: "終焉, 変容, 再生",
    reversedZh: "抗拒改变、勉强维系、僵局", reversedEn: "Resistance to Change, Stagnation, Inertia", reversedJa: "変化への抵抗, 停滞, 膠着"
  },
  "14_temperance": {
    nameZh: "节制", nameEn: "Temperance", nameJa: "節制",
    uprightZh: "平衡、融合、自愈", uprightEn: "Balance, Harmony, Self-Healing", uprightJa: "調和, バランス, 自己治癒",
    reversedZh: "失衡、纵容、冲突", reversedEn: "Imbalance, Excess, Lack of Alignment", reversedJa: "不調和, 不摂生, 葛藤"
  },
  "15_devil": {
    nameZh: "恶魔", nameEn: "The Devil", nameJa: "悪魔",
    uprightZh: "束缚、欲望执念、物质主义", uprightEn: "Bondage, Obsession, Materialism", uprightJa: "束縛, 欲望の執着, 物質主義",
    reversedZh: "觉醒、重获自由、打破囚笼", reversedEn: "Awakening, Freedom, Breaking Chains", reversedJa: "覚醒, 自由の奪還, 束縛からの解放"
  },
  "16_tower": {
    nameZh: "高塔", nameEn: "The Tower", nameJa: "塔",
    uprightZh: "骤变、崩溃、真相显露", uprightEn: "Sudden Change, Ruin, Revelation", uprightJa: "突然の崩壊, 劇的な変化, 天啓",
    reversedZh: "逃过劫难、慢性崩溃、拒绝重建", reversedEn: "Avoiding Ruin, Fear of Change, Rebuilding", reversedJa: "危機の回避, 変化への恐怖, 再建の遅れ"
  },
  "17_star": {
    nameZh: "星星", nameEn: "The Star", nameJa: "星",
    uprightZh: "希望、信心、星光治愈", uprightEn: "Hope, Faith, Healing", uprightJa: "希望, 信頼, 癒やし",
    reversedZh: "失望、方向迷失、信心受挫", reversedEn: "Despair, Lack of Faith, Disconnection", reversedJa: "失望, 自信喪失, 迷い"
  },
  "18_moon": {
    nameZh: "月亮", nameEn: "The Moon", nameJa: "月",
    uprightZh: "潜意识、不安恐惧、未知", uprightEn: "Illusion, Subconscious, Anxiety", uprightJa: "潜在意識, 不安, 幻想",
    reversedZh: "拨云见日、直觉重现、解除疑虑", reversedEn: "Releasing Fear, Truth Revealed, Intuition", reversedJa: "不安の解消, 直感の目覚め, 真実の露呈"
  },
  "19_sun": {
    nameZh: "太阳", nameEn: "The Sun", nameJa: "太陽",
    uprightZh: "成功、活力、无比明晰", uprightEn: "Success, Vitality, Radiance", uprightJa: "成功, 活力, 喜び",
    reversedZh: "短暂阴霾、活力流失、骄傲自负", reversedEn: "Temporary Cloudiness, Low Energy, Ego", reversedJa: "一時的な陰り, 空回り, 慢心"
  },
  "20_judgement": {
    nameZh: "审判", nameEn: "Judgement", nameJa: "審判",
    uprightZh: "觉醒、救赎、聆听天启", uprightEn: "Awakening, Redemption, Calling", uprightJa: "覚醒, 再生, 天命の招き",
    reversedZh: "自我怀疑、拒绝宽恕、逃避决断", reversedEn: "Self-Doubt, Refusal to Answer, Regret", reversedJa: "自己疑念, 決断の遅れ, 後悔"
  },
  "21_world": {
    nameZh: "世界", nameEn: "The World", nameJa: "世界",
    uprightZh: "大圆满、成功、旅程谢幕", uprightEn: "Completion, Integration, Triumph", uprightJa: "完成, 統合, 満願成就",
    reversedZh: "功亏一篑、未竟事业、拒绝终结", reversedEn: "Incompletion, Lack of Closure, Stagnation", reversedJa: "未完成, 中途半端, 停滞"
  }
};

// Initiate Tarot Reading endpoint
app.post("/api/tarot", (req, res) => {
  const { prompt, cards, lang } = req.body;
  const activeLang = (lang === "en" || lang === "ja" || lang === "zh") ? lang : "zh";

  if (!prompt || typeof prompt !== "string") {
    const errText = activeLang === "en" ? "Please state your question first." : activeLang === "ja" ? "最初に質問を入力してください。" : "请输入你想询问的问题。";
    return res.status(400).json({ error: errText });
  }

  if (!cards || !Array.isArray(cards) || cards.length !== 3) {
    const errCards = activeLang === "en" ? "You must choose exactly 3 cards." : activeLang === "ja" ? "必ず3枚のカードを選択してください。" : "必须选择3张牌来进行占卜。";
    return res.status(400).json({ error: errCards });
  }

  const request_id = `tarot_session_${Math.random().toString(36).substring(2, 11)}`;

  // Structure the session object
  const sessionCards = cards.map((c: any, index: number) => {
    const position = (index === 0 ? "past" : index === 1 ? "present" : "future") as "past" | "present" | "future";
    return {
      id: c.id,
      nameEn: c.nameEn || c.name || "Unknown",
      nameZh: c.nameZh || "未知",
      nameJa: c.nameJa || "未知",
      isReversed: Math.random() < 0.35, // 35% chance of being reversed
      position
    };
  });

  const session: ReadingSession = {
    status: "LOADING",
    request_id,
    prompt,
    lang: activeLang,
    cards: sessionCards,
    createdAt: Date.now(),
  };

  sessions.set(request_id, session);

  // Trigger background generation
  setTimeout(async () => {
    try {
      const client = getGeminiClient();
      if (!client) {
        const readingHtml = buildFallbackReading(prompt, sessionCards, activeLang);
        session.interpretation = readingHtml;
        session.status = "DONE";
        sessions.set(request_id, session);
        return;
      }

      // Format card description for prompt
      const cardsDesc = sessionCards.map(c => {
        const cardName = activeLang === "en" ? c.nameEn : activeLang === "ja" ? c.nameJa : c.nameZh;
        const direction = c.isReversed 
          ? (activeLang === "en" ? "Reversed" : activeLang === "ja" ? "逆位置" : "逆位") 
          : (activeLang === "en" ? "Upright" : activeLang === "ja" ? "正位置" : "正位");
        const posText = c.position === "past" 
          ? (activeLang === "en" ? "Past" : activeLang === "ja" ? "過去" : "过去")
          : c.position === "present"
            ? (activeLang === "en" ? "Present" : activeLang === "ja" ? "現在" : "现在")
            : (activeLang === "en" ? "Future" : activeLang === "ja" ? "未来" : "未来");
        return `- 【${posText}】: **${cardName}** (${direction})`;
      }).join("\n");

      // System prompt adapted for copperplate style and target language
      let systemInstruction = "";
      let geminiPrompt = "";

      if (activeLang === "zh") {
        systemInstruction = `你是一位优雅、古朴、具有古典学者美感和荣格心理学深度底蕴的塔罗导师。你的美学风格完美对应【古代文艺复兴铜版画】（Ancient Copperplate Engraving）雕刻艺术。
请根据用户的占卜问题以及抽出的三张牌（分别指代过去、现在、未来），提供一份充满厚重历史底蕴、神秘、温和且具有穿透力的中文占卜解读。
你的书写风格应当富有诗意与古典哲学韵味，宛如阅读一本来自16世纪的古老炼金术及天体运行论典籍。
使用优雅的Markdown排版，建议包含：
1. 【古朴序言】：带有铜版刻印艺术质感与群星运行轨迹的引导词。
2. 【铜版画卷剖析】：对 过去（Past）、现在（Present）、未来（Future） 三张牌结合其正逆位情况，进行充满刻痕纹理感与精妙象征隐喻的深度解读。
3. 【群星与铜版印记的启示】：提供给用户具有实践价值、温和而坚定的行动指南。`;

        geminiPrompt = `我的占卜问题是："${prompt}"

我抽中的三张牌是：
${cardsDesc}

请以此为我提供一份详尽古朴的铜版画风格塔罗占卜解读。请使用中文书写。`;
      } else if (activeLang === "ja") {
        systemInstruction = `あなたはルネサンス期の古典学者であり、ユング心理学と古代神秘主義タロットに精通したタロットリーディングの達人です。あなたの審美スタイルは「古代銅版画・エッチング（Ancient Copperplate Engraving）」にインスパイアされています。
ユーザーの質問と、引いた3枚のカード（過去、現在、未来）に基づいて、歴史の重み、神秘的、そして温かみのある日本語タロットリーディングを提供してください。
文章は、16世紀のアルケミー（錬金術）や天文学の古書を紐解くような、優雅で詩的、そして哲学的な美しさを湛えている必要があります。
美しいMarkdown排版を使用し、以下を含めてください：
1. 【銅版画の序言】：刻印アートの質感と星々が語りかける神秘的な導入。
2. 【絵巻の深層解読】：過去（Past）、現在（Present）、未来（Future）のカードと正位置・逆位置に応じた深遠な解釈。
3. 【運命の彫刻と指引】：具体的で心に温かく響く、実践的な行動のアドバイス。`;

        geminiPrompt = `私の占卜の問いは次の通りです：「${prompt}」

引いた3枚のカードは：
${cardsDesc}

これらのカードに基づき、古典的な銅版画（エッチング）の風情を持つ、極めて丁寧なリーディングを日本語で提供してください。`;
      } else {
        // English
        systemInstruction = `You are a mystical Renaissance scholar and Tarot expert adept in Jungian archetype psychology. Your aesthetic philosophy embodies the rustic and timeless craftsmanship of an "Ancient Copperplate Engraving" style of etching.
Provide a deep, reassuring, and highly atmospheric Tarot reading in English based on the user's question and the three drawn cards (representing Past, Present, and Future).
Your tone should be poetic, philosophical, and carry the weight of 16th-century celestial manuals and alchemical manuscripts.
Structure with exquisite Markdown format as follows:
1. 【Engraved Prologue】: A highly atmospheric and mystical introduction echoing celestial geometry.
2. 【The Copperplate Exposition】: In-depth interpretation of the Past, Present, and Future cards with full appreciation of their Upright/Reversed states.
3. 【Revelation & Epilogue】: Constructive, empowering, and gentle guidance summarizing the stream of fate.`;

        geminiPrompt = `My divination query is: "${prompt}"

The three cards pulled are:
${cardsDesc}

Please deliver a gorgeous, deeply detailed Tarot reading with the texture and wisdom of an ancient copperplate etching. Please write entirely in English.`;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: geminiPrompt,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });

      const interpretationText = response.text || (activeLang === "en" ? "The alignment is hidden. Please consult the stars again." : activeLang === "ja" ? "星々が沈黙しています。もう一度占ってください。" : "命运之流暂时隐匿。请重新占卜。");
      session.interpretation = interpretationText;
      session.status = "DONE";
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      session.interpretation = buildFallbackReading(prompt, sessionCards, activeLang) + 
        (activeLang === "en" ? "\n\n*(Note: Star channels congested. Activated ancient fallback scroll)*" : activeLang === "ja" ? "\n\n*(注：星界チャネル混雑のため、代替古文書にて対応します)*" : "\n\n*(注：由于星际信道拥堵，已为您启用古典备用占卜书卷)*");
      session.status = "DONE";
    }
    sessions.set(request_id, session);
  }, 3500);

  return res.json({ request_id, status: "LOADING" });
});

// Polling status endpoint
app.get("/api/tarot/status", (req, res) => {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing session ID" });
  }

  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ error: "Session expired or not found." });
  }

  return res.json({
    status: session.status,
    request_id: session.request_id,
    cards: session.cards,
    interpretation: session.interpretation,
    error: session.error
  });
});

// Fallback algorithm to construct a beautiful local tarot reading
function buildFallbackReading(prompt: string, cards: any[], lang: "zh" | "en" | "ja") {
  const getCardDetails = (c: any) => {
    const k = cardKeywords[c.id];
    let cardName = c.nameZh;
    let stateLabel = c.isReversed ? "逆位" : "正位";
    let kw = c.isReversed ? k.reversedZh : k.uprightZh;
    let desc = "";

    if (lang === "en") {
      cardName = c.nameEn;
      stateLabel = c.isReversed ? "Reversed" : "Upright";
      kw = c.isReversed ? k.reversedEn : k.uprightEn;
      const posLabel = c.position === "past" ? "Past" : c.position === "present" ? "Present" : "Future";
      desc = `### ${posLabel}: ${cardName} (${stateLabel})
- **Keywords**: ${kw}
- **Revelation**: The card ${cardName} appears in your ${posLabel.toLowerCase()} aspect. This denotes that ${c.isReversed ? "energies here are inward-looking, suggesting a block or a hidden spiritual lesson to uncover." : "a radiant, active cosmic stream is steering your path forward, offering divine support for your current query."}`;
    } else if (lang === "ja") {
      cardName = c.nameJa;
      stateLabel = c.isReversed ? "逆位置" : "正位置";
      kw = c.isReversed ? k.reversedJa : k.uprightJa;
      const posLabel = c.position === "past" ? "過去" : c.position === "present" ? "現在" : "未来";
      desc = `### ${posLabel}：${cardName} (${stateLabel})
- **キーワード**：${kw}
- **星海の囁き**：あなたの${posLabel}に${cardName}の${stateLabel}が現れました。これは、${c.isReversed ? "この領域でエネルギーが内省的、あるいは停滞していることを示し、一度立ち止まってアプローチを見直す必要があること" : "明晰で調和の取れた宇宙のパワーが流れており、あなたを力強く後押ししていること"}を告げています。`;
    } else {
      // Simplified Chinese
      const posLabel = c.position === "past" ? "过去" : c.position === "present" ? "现在" : "未来";
      desc = `### ${posLabel}：${cardName} (${stateLabel})
- **纸牌关键词**：${kw}
- **铜刻图画解读**：在你的${posLabel}命运星图内，描绘着${cardName}的${stateLabel}。这印记预示着${c.isReversed ? "这股古老的能量在深处静伏或略有阻隔，指引您内省灵魂、调整前行的重心。" : "一轮璀璨而坚定的天梯之光在普照，鼓舞您坦然承接并信任这个维度的改变。"}`;
    }

    return desc;
  };

  if (lang === "en") {
    return `## Copperplate Chronicle: Reading for 【${prompt}】

> "The copper plates are etched, the stars have turned, and destiny unfolds under the watchful eyes of the cosmos."

---

### 🌌 The Etched Layout Analysis

${getCardDetails(cards[0])}

${getCardDetails(cards[1])}

${getCardDetails(cards[2])}

---

### 🕯️ Alchemical Revelation & Guidance

Tracing the flow from **${cards[0].nameEn}** to **${cards[1].nameEn}**, and culminating in **${cards[2].nameEn}**, your journey displays a sublime progression from consolidation to self-realization.

Pay careful attention to the warning of **${cards[1].nameEn} (${cards[1].isReversed ? "Reversed" : "Upright"})**. Do not rush the horizon; find stillness and trust that the celestial etching of **${cards[2].nameEn}** promises a harmonious alignment.`;
  } else if (lang === "ja") {
    return `## 古代銅版画の秘録：【${prompt}】に関する啓示

> 「銅板に刻まれし不変の軌跡、巡る星々は天球の意志を静かに告げん。」

---

### 🌌 運命の彫刻解読

${getCardDetails(cards[0])}

${getCardDetails(cards[1])}

${getCardDetails(cards[2])}

---

### 🕯️ 錬金術的啓示とガイダンス

**${cards[0].nameJa}** から **${cards[1].nameJa}**、そして終着点としての **${cards[2].nameJa}** へのエネルギーの変遷は、あなたの魂が試練を乗り越えて完成に至る輝かしい道筋を描いています。

現在の状態を示す **${cards[1].nameJa} (${cards[1].isReversed ? "逆位置" : "正位置"})** の啓示に耳を傾けてください。焦って未来を追い求めるのではなく、このカードの教訓を統合することで、未来の **${cards[2].nameJa}** が告げる完璧な結実を確固たるものにできるでしょう。`;
  } else {
    return `## 铜刻秘录：关于【${prompt}】的星轨解答

> “铜版落刻，星移物换，古老的刻痕中铭记着你灵魂行进的隐秘归途。”

---

### 🌌 命运雕痕深度剖析

${getCardDetails(cards[0])}

${getCardDetails(cards[1])}

${getCardDetails(cards[2])}

---

### 🕯️ 炼金术启示与指引

综合来看，从**${cards[0].nameZh}**走向**${cards[1].nameZh}**，最终归于**${cards[2].nameZh}**，你所探求的问题刻画出一条由旧历积淀、在现实中蜕变、于未来圆满的黄金法则。

当下的处境需要你特别关照 **${cards[1].nameZh} (${cards[1].isReversed ? "逆位" : "正位"})** 带来的双重暗示。摒弃浮躁，在铜刻画卷中寻找深厚的内聚力。未来的 **${cards[2].nameZh}** 已经承诺了最终的显化，以最坚韧的步伐向前走，你终将获得属于你的天体运转回响。`;
  }
}

// Serve Frontend Vite SPA
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tarot Server listening on http://localhost:${PORT}`);
  });
}

startServer();
