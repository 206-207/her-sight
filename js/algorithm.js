/**
 * ============================================================
 * 她影 · 灵魂匹配算法
 * 依赖：CELEBRITIES（data_celebrities.js）
 * ============================================================
 */

// 16 种灵魂代码 → 名人 key 的 O(1) 查表映射
const SOUL_CODE_MAP = {
  "🌙💗🌊🔥": "li_qingzhao",
  "🌙💗🌊🌳": "san_mao",
  "🌙💗🏔️🔥": "simone_de_beauvoir",
  "🌙💗🏔️🌳": "lin_huiyin",
  "🌙🧭🌊🔥": "zhang_ailing",
  "🌙🧭🌊🌳": "jk_rowling",
  "🌙🧭🏔️🔥": "marie_curie",
  "🌙🧭🏔️🌳": "tu_youyou",
  "☀️💗🌊🔥": "audrey_hepburn",
  "☀️💗🌊🌳": "frida_kahlo",
  "☀️💗🏔️🔥": "qiu_jin",
  "☀️💗🏔️🌳": "malala",
  "☀️🧭🌊🔥": "coco_chanel",
  "☀️🧭🌊🌳": "ruth_bader_ginsburg",
  "☀️🧭🏔️🔥": "wu_zetian",
  "☀️🧭🏔️🌳": "agatha_christie",
};

/**
 * 主算法入口：根据答题选项数组，匹配灵魂同频者
 * @param {Array} answers - 每题选中的 option 对象数组（长度 15）
 * @returns {{
 *   code: string,              // 4 位 emoji 灵魂代码
 *   celebrity: object,         // 匹配到的名人完整资料
 *   alsoLike: object[],        // 相似度 Top2、3 两位
 *   scores: {moon:number, sun:number, heart:number, mind:number, flow:number, mountain:number, flame:number, root:number},
 *   dimensionDetail: {         // 四维方向及分差（用于可视化）
 *     energy:{dir:string,a:number,b:number},
 *     judge:{dir:string,a:number,b:number},
 *     life:{dir:string,a:number,b:number},
 *     root:{dir:string,a:number,b:number}
 *   }
 * }}
 */
function matchSoul(answers) {
  // Step 1：累加 8 个方向的分数
  const scores = {
    moon: 0,
    sun: 0,
    heart: 0,
    mind: 0,
    flow: 0,
    mountain: 0,
    flame: 0,
    root: 0,
  };

  answers.forEach((opt) => {
    if (!opt || !opt.scores) return;
    Object.entries(opt.scores).forEach(([dim, point]) => {
      if (typeof scores[dim] === "number") {
        scores[dim] += point;
      }
    });
  });

  // Step 2：四维判方向 → 生成灵魂代码 emoji
  // 规则：分数 >= 取 A，否则取 B（平手取前者，默认更温柔的那一极）
  const energyMoon = scores.moon >= scores.sun;
  const judgeHeart = scores.heart >= scores.mind;
  const lifeFlow = scores.flow >= scores.mountain;
  const rootFlame = scores.flame >= scores.root;

  const code =
    (energyMoon ? "🌙" : "☀️") +
    (judgeHeart ? "💗" : "🧭") +
    (lifeFlow ? "🌊" : "🏔️") +
    (rootFlame ? "🔥" : "🌳");

  // Step 3：查表 → 名人数据
  const celebKey = SOUL_CODE_MAP[code];
  const celebrity = celebKey ? CELEBRITIES[celebKey] : _fallbackCeleb(scores);

  // Step 4：相似度排名（Hamming 距离：相同维度越多越像；相同则用分差加权）
  const ranking = Object.values(CELEBRITIES)
    .map((c) => ({
      celeb: c,
      sameCount: countSameDimensions(code, c.code),
      // 加权分差（越小越像），用于同 Hamming 的 tie-break
      diffScore: calcDiffScore(scores, c.code),
    }))
    .sort((a, b) => {
      if (b.sameCount !== a.sameCount) return b.sameCount - a.sameCount;
      return a.diffScore - b.diffScore;
    });

  // Top2&3（第 1 名永远是自己）
  const alsoLike = ranking.slice(1, 3).map((r) => r.celeb);

  return {
    code,
    celebrity,
    alsoLike,
    scores,
    dimensionDetail: {
      energy: {
        dir: energyMoon ? "🌙 月之向" : "☀️ 日之向",
        a: scores.moon,
        b: scores.sun,
      },
      judge: {
        dir: judgeHeart ? "💗 心之向" : "🧭 思之向",
        a: scores.heart,
        b: scores.mind,
      },
      life: {
        dir: lifeFlow ? "🌊 水之向" : "🏔️ 山之向",
        a: scores.flow,
        b: scores.mountain,
      },
      root: {
        dir: rootFlame ? "🔥 焰之向" : "🌳 根之向",
        a: scores.flame,
        b: scores.root,
      },
    },
  };
}

/** 两个 4-emoji 代码有几个位置相同（Hamming 相似度）*/
function countSameDimensions(codeA, codeB) {
  if (!codeA || !codeB) return 0;
  let same = 0;
  // codeA/codeB 都是 4 个 emoji（每个 emoji 长度 = 2 JS chars，所以按 0/2/4/6 取）
  for (let i = 0; i < 4; i++) {
    const a = codeA.substr(i * 2, 2);
    const b = codeB.substr(i * 2, 2);
    if (a && b && a === b) same++;
  }
  return same;
}

/** Tie-break 分差得分：把用户四维分数和名人代码做加权归一化差，越小越像 */
function calcDiffScore(scores, celebCode) {
  if (!celebCode) return Infinity;
  const dirs = [
    { emoji: "🌙", hi: scores.moon, lo: scores.sun },
    { emoji: "💗", hi: scores.heart, lo: scores.mind },
    { emoji: "🌊", hi: scores.flow, lo: scores.mountain },
    { emoji: "🔥", hi: scores.flame, lo: scores.root },
  ];
  let total = 0;
  for (let i = 0; i < 4; i++) {
    const d = dirs[i];
    const celebIsHi = celebCode.substr(i * 2, 2) === d.emoji;
    const hiMinusLo = d.hi - d.lo; // 越大说明用户越倾向 hi
    // 如果名人是 hi，希望 hiMinusLo 大；否则希望小
    total += celebIsHi ? -hiMinusLo : hiMinusLo;
  }
  return total;
}

/** Fallback：万一查表失败（理论不会发生），就选分数最匹配的一位 */
function _fallbackCeleb(scores) {
  // 用临时代码找
  const tmpCode =
    (scores.moon >= scores.sun ? "🌙" : "☀️") +
    (scores.heart >= scores.mind ? "💗" : "🧭") +
    (scores.flow >= scores.mountain ? "🌊" : "🏔️") +
    (scores.flame >= scores.root ? "🔥" : "🌳");
  const k = SOUL_CODE_MAP[tmpCode];
  return k ? CELEBRITIES[k] : Object.values(CELEBRITIES)[0];
}
