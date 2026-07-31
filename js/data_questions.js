/**
 * ============================================================
 * 她影 · 15 道题完整题库
 * 每题：题干 + 4 选项（每个选项附带维度加分 scores）
 * 维度 key 约定：
 *   moon（月🌙） / sun（日☀️）
 *   heart（心💗） / mind（思🧭）
 *   flow（水🌊） / mountain（山🏔️）
 *   flame（焰🔥） / root（根🌳）
 *
 * 权重规则：
 *   - 基础题：加 1 分
 *   - 核心维度题：加 2 分
 *   - 综合校准题（最后 3 道）：加 2 分
 * ============================================================
 */

const QUESTIONS = [
  // ============ Q1 ============
  {
    id: "Q1",
    stem: "如果给你一整天完全自由、没人打扰的时间，你最想？",
    options: [
      {
        label: "A",
        text: "窝在家里看书/看老电影/发呆，窗帘拉上、手机静音",
        scores: { moon: 1 },
      },
      {
        label: "B",
        text: "约上最好的 2~3 个闺蜜，去探店、逛展、下午茶",
        scores: { sun: 1 },
      },
      {
        label: "C",
        text: "一个人去美术馆/老巷/植物园走走，不用赶时间",
        scores: { moon: 1, flow: 1 },
      },
      {
        label: "D",
        text: "报个有趣的体验课（陶艺/插花/即兴），认识新朋友",
        scores: { sun: 1, flame: 1 },
      },
    ],
  },

  // ============ Q2 ============
  {
    id: "Q2",
    stem: "团队项目里，你最常扮演的角色是？",
    options: [
      {
        label: "A",
        text: "默默把自己那部分做到最好的人，不多话但特别靠谱",
        scores: { moon: 1, root: 1 },
      },
      {
        label: "B",
        text: "满脑子创意和点子的人，方案我来 brainstorm",
        scores: { flame: 1, flow: 1 },
      },
      {
        label: "C",
        text: "负责拆解任务、分配分工、推动 Deadline 的那个人",
        scores: { mind: 1, mountain: 1 },
      },
      {
        label: "D",
        text: "气氛担当 + 粘合剂，大家吵架了我来调解",
        scores: { heart: 1, sun: 1 },
      },
    ],
  },

  // ============ Q3 ============
  {
    id: "Q3",
    stem: "闺蜜被渣男甩了，半夜哭着打给你，你第一反应是？",
    options: [
      {
        label: "A",
        text: "立刻打车过去，抱着她一起哭，先让她把情绪宣泄出来",
        scores: { heart: 1, sun: 1 },
      },
      {
        label: "B",
        text: "冷静地问清楚细节，帮她分析对方的问题，想好下一步",
        scores: { mind: 1 },
      },
      {
        label: "C",
        text: "电话里陪她聊天，告诉她「我懂你」，明天再过去看她",
        scores: { heart: 1, moon: 1 },
      },
      {
        label: "D",
        text: "直接列一个「闺蜜振作清单」：买好吃的、订机票散心、介绍新朋友",
        scores: { mind: 1, mountain: 1 },
      },
    ],
  },

  // ============ Q4 ============
  {
    id: "Q4",
    stem: "周末晚上只想窝着看一部电影，你会挑哪种类型？",
    options: [
      {
        label: "A",
        text: "细腻感人的文艺爱情片/剧情片（比如《爱在黎明破晓前》）",
        scores: { heart: 1, moon: 1 },
      },
      {
        label: "B",
        text: "烧脑悬疑/推理片（比如阿加莎或诺兰的作品）",
        scores: { mind: 1, root: 1 },
      },
      {
        label: "C",
        text: "热血欢乐/轻松搞笑的爆米花片，看完就开心",
        scores: { sun: 1, flow: 1 },
      },
      {
        label: "D",
        text: "传记/历史/纪录片，看完能学到东西的那种",
        scores: { root: 1, mountain: 1 },
      },
    ],
  },

  // ============ Q5 · 核心题 2 分 ============
  {
    id: "Q5",
    stem: "你心目中「活得很厉害」的女性，更接近下面哪种？",
    weight: 2,
    options: [
      {
        label: "A",
        text: "不受世俗眼光束缚，用自己喜欢的方式过一生的人",
        scores: { flame: 2 },
      },
      {
        label: "B",
        text: "在一个领域里深耕多年，做到行业顶尖的人",
        scores: { root: 2 },
      },
      {
        label: "C",
        text: "温柔地改变了很多人的命运，自己却低调不张扬的人",
        scores: { heart: 2, root: 1 },
      },
      {
        label: "D",
        text: "挑战了不公平的规则，为后来者开辟新路的人",
        scores: { flame: 2, mind: 1 },
      },
    ],
  },

  // ============ Q6 ============
  {
    id: "Q6",
    stem: "如果可以拥有一种理想中的亲密关系，你更向往？",
    options: [
      {
        label: "A",
        text: "两个人一起探索世界，永远有新鲜事可以一起做",
        scores: { flow: 1, sun: 1 },
      },
      {
        label: "B",
        text: "彼此独立、有各自的事业和空间，互相支持而不依赖",
        scores: { mountain: 1, moon: 1 },
      },
      {
        label: "C",
        text: "安稳踏实，一起经营共同的生活和未来",
        scores: { mountain: 1, root: 1 },
      },
      {
        label: "D",
        text: "深度灵魂共振，无话不谈，彼此是对方的精神知己",
        scores: { heart: 1, moon: 1 },
      },
    ],
  },

  // ============ Q7 · 核心题 2 分 ============
  {
    id: "Q7",
    stem: "不考虑钱和现实限制，你最想做的事情是？",
    weight: 2,
    options: [
      {
        label: "A",
        text: "环游世界，把没看过的风景都看一遍，没体验的生活都体验一遍",
        scores: { flow: 2, flame: 1 },
      },
      {
        label: "B",
        text: "做一个自己的品牌/项目/研究，做成能真正留在这个世界上的事",
        scores: { root: 2, mountain: 1 },
      },
      {
        label: "C",
        text: "投身公益/教育/环保，用自己的力量改变一些不公平的事",
        scores: { heart: 2, flame: 1 },
      },
      {
        label: "D",
        text: "找一个喜欢的地方隐居，读书、写作、创作，不被人打扰",
        scores: { moon: 2, root: 1 },
      },
    ],
  },

  // ============ Q8 ============
  {
    id: "Q8",
    stem: "深夜emo / 遇到重大挫败时，你通常怎么消化？",
    options: [
      {
        label: "A",
        text: "自己一个人慢慢想，听歌、写日记、哭一场就好了",
        scores: { moon: 1, heart: 1 },
      },
      {
        label: "B",
        text: "找最好的朋友吐槽，把情绪一股脑倒出来",
        scores: { sun: 1, heart: 1 },
      },
      {
        label: "C",
        text: "冷静分析原因，总结教训，制定一个「下次怎么避免」的方案",
        scores: { mind: 1, mountain: 1 },
      },
      {
        label: "D",
        text: "立刻让自己忙起来：工作、学习、运动——没时间想就不会难过了",
        scores: { mountain: 1, root: 1 },
      },
    ],
  },

  // ============ Q9 · 核心题 2 分 ============
  {
    id: "Q9",
    stem: "理想中安排得很完美的一周，长什么样？",
    weight: 2,
    options: [
      {
        label: "A",
        text: "有计划但不排满：固定时间工作学习，也留空白给惊喜和灵感",
        scores: { flow: 2, root: 1 },
      },
      {
        label: "B",
        text: "日程表清清楚楚：几点做什么，一项一项打勾完成最有成就感",
        scores: { mountain: 2, root: 1 },
      },
      {
        label: "C",
        text: "完全不计划：想做什么就做什么， spontaneity 才是生活的美",
        scores: { flow: 2, flame: 1 },
      },
      {
        label: "D",
        text: "工作日专注冲刺，周末约满社交/活动，和喜欢的人一起度过",
        scores: { sun: 2, mountain: 1 },
      },
    ],
  },

  // ============ Q10 ============
  {
    id: "Q10",
    stem: "出门前选今天的穿搭风格，你更倾向？",
    options: [
      {
        label: "A",
        text: "柔和舒服风：毛衣、长裙、大地色，干净温暖不张扬",
        scores: { heart: 1, root: 1 },
      },
      {
        label: "B",
        text: "简洁利落风：黑白灰、剪裁好、质感优先，气场最重要",
        scores: { mind: 1, mountain: 1 },
      },
      {
        label: "C",
        text: "混搭实验风：颜色敢撞、款式敢搭，每天都想不一样",
        scores: { flame: 1, flow: 1 },
      },
      {
        label: "D",
        text: "根据今天的场合/见的人搭配，得体 + 一点点小心机",
        scores: { sun: 1, mind: 1 },
      },
    ],
  },

  // ============ Q11 ============
  {
    id: "Q11",
    stem: "你在朋友圈/社交平台上的表达习惯是？",
    options: [
      {
        label: "A",
        text: "很少发，偶尔发一次也是分组可见或仅自己可见",
        scores: { moon: 1, root: 1 },
      },
      {
        label: "B",
        text: "想到什么就发什么：日常、美食、心情、吐槽，频率比较高",
        scores: { sun: 1, flow: 1 },
      },
      {
        label: "C",
        text: "只发精心编辑过的内容：作品、成就、有质量的思考",
        scores: { mountain: 1, flame: 1 },
      },
      {
        label: "D",
        text: "以点赞和互动为主，自己发的不多但一直在看",
        scores: { mind: 1, heart: 1 },
      },
    ],
  },

  // ============ Q12 · 核心题 2 分 ============
  {
    id: "Q12",
    stem: "（道德困境）你最好的朋友做错事了，但她情有可原（比如为了家人撒谎），你会怎么处理？",
    weight: 2,
    options: [
      {
        label: "A",
        text: "我理解她的处境，会选择站在她这边——原则有时也要为人让步",
        scores: { heart: 2 },
      },
      {
        label: "B",
        text: "我会坦诚告诉她我的看法，对错先讲清楚，但情感上仍支持她",
        scores: { mind: 2, heart: 1 },
      },
      {
        label: "C",
        text: "我不会插手她的选择，每个人都要为自己的决定负责",
        scores: { mind: 2, flow: 1 },
      },
      {
        label: "D",
        text: "我会帮她想一个两全其美的补救方案，把损失降到最小",
        scores: { mountain: 2, heart: 1 },
      },
    ],
  },

  // ============ Q13 · 校准题 2 分 ============
  {
    id: "Q13",
    stem: "（校准题）以下 4 种女性的人生故事，你最感兴趣、最想深入了解的是？",
    weight: 2,
    options: [
      {
        label: "A",
        text: "流浪作家：走遍万水千山，用爱和文字记录远方与人间",
        scores: { moon: 2, heart: 2, flow: 1 }, // 三毛型
      },
      {
        label: "B",
        text: "科学巨匠：在实验室里默默耕耘数十年，最终改变世界",
        scores: { moon: 2, mind: 2, root: 1 }, // 屠呦呦/居里型
      },
      {
        label: "C",
        text: "革命/平权先驱：用热血和行动，为更多人赢得平等与自由",
        scores: { sun: 2, heart: 2, flame: 1 }, // 秋瑾/马拉拉/波伏娃
      },
      {
        label: "D",
        text: "商业/时尚先锋：打破常规，在男人的世界里登顶行业之巅",
        scores: { sun: 2, mind: 2, flame: 1 }, // 武则天/香奈儿
      },
    ],
  },

  // ============ Q14 · 校准题 2 分 ============
  {
    id: "Q14",
    stem: "（校准题）你更认同下面哪一句人生格言？",
    weight: 2,
    options: [
      {
        label: "A",
        text: "「世界上只有一种真正的英雄主义，就是认清了生活的真相后还依然热爱它。」",
        scores: { heart: 2, flow: 1, flame: 1 },
      },
      {
        label: "B",
        text: "「把每一件简单的事做好就是不简单，把每一件平凡的事做好就是不平凡。」",
        scores: { root: 2, mountain: 1, mind: 1 },
      },
      {
        label: "C",
        text: "「我们一路奋战，不是为了改变世界，而是为了不让世界改变我们。」",
        scores: { flame: 2, mountain: 1, heart: 1 },
      },
      {
        label: "D",
        text: "「未经审视的生活不值得过。」——苏格拉底",
        scores: { mind: 2, moon: 1, mountain: 1 },
      },
    ],
  },

  // ============ Q15 · 核心校准题 2 分 ============
  {
    id: "Q15",
    stem: "（最后一题）如果让你用一种自然意象形容自己，你选？",
    weight: 2,
    options: [
      {
        label: "A",
        text: "🌙 月：安静、内敛，光芒不耀眼，但一直温柔地照着",
        scores: { moon: 2 },
      },
      {
        label: "B",
        text: "☀️ 日：温暖、外放，身边的人都能感受到你的光和热",
        scores: { sun: 2 },
      },
      {
        label: "C",
        text: "🌊 水：灵动、自由，遇到什么形状就变成什么形状",
        scores: { flow: 2 },
      },
      {
        label: "D",
        text: "🏔️ 山：沉稳、坚定，脚下有根，风吹雨打都不动",
        scores: { mountain: 2 },
      },
    ],
    // 注：最后一题的 E/F 两个维度（心/思、焰/根）可以通过组合题 Q13/Q14 的加权覆盖
    // 所以这题集中校准第一维和第三维（最容易极端的两维）
  },
];

// 保证 15 道
if (QUESTIONS.length !== 15) {
  console.warn("⚠️ QUESTIONS 数量应为 15 道，当前：", QUESTIONS.length);
}
