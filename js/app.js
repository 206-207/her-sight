/**
 * ============================================================
 * 她影 · 主应用逻辑 & 交互层
 * 依赖：CELEBRITIES、QUESTIONS、matchSoul()
 * ============================================================
 */

(function () {
  "use strict";

  // ============================================================
  // 0. 全局状态
  // ============================================================
  const STATE = {
    currentQIdx: 0,      // 当前题号（0~14）
    answers: [],         // 每题选中的 option 对象（长度 15，null 表示未答）
    total: QUESTIONS.length, // 15
    result: null,        // matchSoul 返回的结果
  };

  // 初始化 answers 全为空
  for (let i = 0; i < STATE.total; i++) STATE.answers.push(null);

  // ============================================================
  // 1. 工具函数：DOM 查询
  // ============================================================
  const $ = (id) => document.getElementById(id);

  // ============================================================
  // 2. 视图切换
  // ============================================================
  const VIEWS = {
    landing: $("viewLanding"),
    quiz: $("viewQuiz"),
    matching: $("viewMatching"),
    result: $("viewResult"),
  };

  function showView(name) {
    Object.entries(VIEWS).forEach(([k, el]) => {
      if (el) el.classList.toggle("active", k === name);
    });
    // 回到顶部（移动端体验）
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  // ============================================================
  // 3. 首页：开始按钮
  // ============================================================
  $("btnStart").addEventListener("click", () => {
    STATE.currentQIdx = 0;
    for (let i = 0; i < STATE.total; i++) STATE.answers[i] = null;
    renderQuestion();
    showView("quiz");
  });

  $("btnBackHome").addEventListener("click", () => {
    if (confirm("返回首页将清空已答题进度，确定吗？")) {
      showView("landing");
    }
  });

  // ============================================================
  // 4. 答题页：渲染题目 + 选项
  // ============================================================
  const qStem = $("questionStem");
  const qOptions = $("optionsList");
  const qNow = $("quizNow");
  const qTotal = $("quizTotal");
  const progressFill = $("progressFill");
  const btnPrev = $("btnPrev");
  const btnNext = $("btnNext");

  qTotal.textContent = STATE.total;

  function renderQuestion() {
    const idx = STATE.currentQIdx;
    const q = QUESTIONS[idx];

    // 进度 UI
    qNow.textContent = idx + 1;
    const pct = ((idx + (STATE.answers[idx] ? 1 : 0)) / STATE.total) * 100;
    progressFill.style.width = pct + "%";

    // 题面（重新触发入场动画）
    const card = $("questionCard");
    card.style.animation = "none";
    // eslint-disable-next-line no-unused-expressions
    card.offsetHeight; // reflow
    card.style.animation = "";

    qStem.textContent = q.stem;

    // 渲染 4 选项
    qOptions.innerHTML = "";
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.type = "button";

      // 如果这题之前选过，高亮
      const selected = STATE.answers[idx] && STATE.answers[idx].label === opt.label;
      if (selected) btn.classList.add("selected");

      btn.innerHTML = `
        <span class="option-label">${opt.label}</span>
        <span class="option-text">${opt.text}</span>
      `;

      btn.addEventListener("click", () => onSelectOption(idx, opt, btn));
      qOptions.appendChild(btn);
    });

    // 上一题/下一题按钮状态
    btnPrev.disabled = idx === 0;
    btnNext.disabled = STATE.answers[idx] == null;
    btnNext.textContent = idx === STATE.total - 1 ? "完成，寻找同频者 ✨" : "下一题 →";
  }

  function onSelectOption(idx, option, btnEl) {
    // 记录选择
    STATE.answers[idx] = option;

    // 视觉：同组其它选项去掉 selected
    const siblings = qOptions.querySelectorAll(".option-btn");
    siblings.forEach((b) => b.classList.remove("selected"));
    btnEl.classList.add("selected");

    // 进度条 +1
    progressFill.style.width = ((idx + 1) / STATE.total) * 100 + "%";

    // 启用下一题按钮
    btnNext.disabled = false;
  }

  btnPrev.addEventListener("click", () => {
    if (STATE.currentQIdx > 0) {
      STATE.currentQIdx--;
      renderQuestion();
    }
  });

  btnNext.addEventListener("click", () => {
    if (STATE.currentQIdx < STATE.total - 1) {
      STATE.currentQIdx++;
      renderQuestion();
    } else {
      // 完成，进入匹配页
      startMatching();
    }
  });

  // ============================================================
  // 5. 匹配页：3 秒仪式感动效，然后计算结果
  // ============================================================
  function startMatching() {
    showView("matching");

    const title1 = $("matchingTitle");
    const title2 = $("matchingTitle2");
    const e1 = $("mEmoji1");
    const e2 = $("mEmoji2");
    const e3 = $("mEmoji3");
    const e4 = $("mEmoji4");
    const glow = $("matchingGlow");

    // 先重置
    [e1, e2, e3, e4].forEach((e) => {
      e.classList.remove("show");
    });
    glow.classList.remove("pulse");
    title2.style.opacity = 0;

    // 0.0s：第 1 个 emoji
    setTimeout(() => e1.classList.add("show"), 10);
    // 0.4s：第 2 个
    setTimeout(() => e2.classList.add("show"), 410);
    // 0.8s：第 3 个 + 文案切换
    setTimeout(() => {
      e3.classList.add("show");
      title1.textContent = "跨越时空，于 16 位灵魂中";
    }, 810);
    // 1.2s：第 4 个
    setTimeout(() => e4.classList.add("show"), 1210);
    // 1.7s：文案切换
    setTimeout(() => {
      title1.textContent = "寻找同频者...";
      title2.style.opacity = 1;
      title2.textContent = "即将找到那个她";
    }, 1700);
    // 2.2s：发光扩散
    setTimeout(() => glow.classList.add("pulse"), 2200);
    // 3.0s：计算结果 + 跳转
    setTimeout(() => {
      computeAndShowResult();
    }, 3000);
  }

  // ============================================================
  // 6. 计算匹配结果 + 渲染结果页
  // ============================================================
  function computeAndShowResult() {
    const result = matchSoul(STATE.answers);
    STATE.result = result;
    renderResult(result);
    showView("result");
  }

  function renderResult(r) {
    const { code, celebrity, alsoLike } = r;

    // --- 横幅：灵魂代码 + 原型名 ---
    $("rCode").textContent = code;
    $("rArchetype").textContent = celebrity.archetype;

    // --- 主分享卡片：名人信息 ---
    $("rName").textContent = celebrity.name;
    $("rNameEn").textContent = celebrity.nameEn;

    // 头像：主题色渐变 + emoji
    const [g1, g2] = celebrity.themeGradient;
    const portrait = $("rPortrait");
    portrait.style.background = `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`;
    portrait.textContent = celebrity.themeEmoji;

    // meta 标签：era + fields + keywords 前 2
    const metaEl = $("rMeta");
    metaEl.innerHTML = "";
    const eraTag = document.createElement("span");
    eraTag.className = "celeb-tag";
    eraTag.textContent = celebrity.era.split("｜")[0]?.trim() || celebrity.era;
    metaEl.appendChild(eraTag);
    celebrity.fields.forEach((f) => {
      const t = document.createElement("span");
      t.className = "celeb-tag";
      t.textContent = f;
      metaEl.appendChild(t);
    });

    $("rTagline").textContent = celebrity.tagline;

    // 分享卡上的一条精华同频点
    $("shareResonance").textContent = celebrity.resonance[0];

    // --- 同频点列表（依次 stagger 入场）---
    const resoEl = $("rResonance");
    resoEl.innerHTML = "";
    celebrity.resonance.forEach((text, i) => {
      const item = document.createElement("div");
      item.className = "resonance-item";
      item.style.animationDelay = `${i * 80}ms`;
      item.textContent = text;
      resoEl.appendChild(item);
      setTimeout(() => item.classList.add("show"), 120 + i * 80);
    });

    // --- 生平简介 ---
    $("rBio").textContent = celebrity.bio;

    // --- 成就卡片（横排滑动）---
    const achEl = $("rAchievements");
    achEl.innerHTML = "";
    celebrity.achievements.forEach((a) => {
      const card = document.createElement("div");
      card.className = "achievement-card";
      card.innerHTML = `
        <div class="ach-icon">${a.icon}</div>
        <div class="ach-title">${a.title}</div>
        <div class="ach-desc">${a.desc}</div>
      `;
      achEl.appendChild(card);
    });

    // --- 金句 ---
    const quotesEl = $("rQuotes");
    quotesEl.innerHTML = "";
    celebrity.quotes.forEach((q) => {
      const item = document.createElement("div");
      item.className = "quote-item";
      item.innerHTML = `<p class="quote-text font-serif-cn">${q}</p>`;
      quotesEl.appendChild(item);
    });

    // --- 你也可能同频（Top2、Top3）---
    const likeEl = $("rAlsoLike");
    likeEl.innerHTML = "";
    alsoLike.forEach((c) => {
      const [cg1, cg2] = c.themeGradient;
      const card = document.createElement("div");
      card.className = "also-like-card";
      card.innerHTML = `
        <div class="also-like-portrait" style="background: linear-gradient(135deg, ${cg1}, ${cg2})">
          ${c.themeEmoji}
        </div>
        <div class="also-like-name font-serif-cn">${c.name}</div>
        <div class="also-like-arch">${c.archetype}型 · ${c.code}</div>
      `;
      // 点击也可以快速切换查看（不重算算法，只改展示）
      card.addEventListener("click", () => {
        if (confirm(`查看「${c.name}」的详情？（不会重置你的测试结果）`)) {
          const fakeResult = { ...r, celebrity: c };
          renderResult(fakeResult);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
      likeEl.appendChild(card);
    });
  }

  // ============================================================
  // 7. 分享图：html2canvas 渲染 shareCard → Modal 预览
  // ============================================================
  $("btnShare").addEventListener("click", async () => {
    const btn = $("btnShare");
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "⏳ 正在生成...";

    try {
      const card = $("shareCard");
      const canvas = await html2canvas(card, {
        backgroundColor: "#fffdf9",
        scale: 2, // 高清 2x
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");

      // 插入 Modal
      const wrap = $("modalImgWrap");
      wrap.innerHTML = "";
      const img = document.createElement("img");
      img.src = dataUrl;
      img.alt = "她影 · 灵魂同频分享卡";
      wrap.appendChild(img);

      // 显示 Modal
      $("shareModal").classList.add("show");
    } catch (err) {
      console.error("生成分享图失败：", err);
      alert("生成失败，请稍后再试～");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });

  // Modal 关闭
  $("btnModalClose").addEventListener("click", () => {
    $("shareModal").classList.remove("show");
  });
  $("shareModal").addEventListener("click", (e) => {
    if (e.target.id === "shareModal") {
      $("shareModal").classList.remove("show");
    }
  });

  // ============================================================
  // 8. 复制链接
  // ============================================================
  $("btnCopyLink").addEventListener("click", async () => {
    const c = STATE.result?.celebrity;
    const text = c
      ? `我在「她影」找到了灵魂同频者——${c.name}（${c.archetype}型 · ${c.code}）。\n你也来测测，你和哪位古今中外的女性名人最同频？\n${location.href}`
      : `「她影 · 女性名人灵魂同频测试」：15 道题，找到和你灵魂同频的她。\n${location.href}`;

    try {
      await navigator.clipboard.writeText(text);
      const btn = $("btnCopyLink");
      const original = btn.innerHTML;
      btn.innerHTML = "✅ 已复制！";
      setTimeout(() => (btn.innerHTML = original), 1800);
    } catch {
      // 降级：textarea 兼容
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        alert("已复制到剪贴板～");
      } catch {
        alert("复制失败，请手动复制页面链接～");
      }
      document.body.removeChild(ta);
    }
  });

  // ============================================================
  // 9. 再找一次（重玩）
  // ============================================================
  $("btnRestart").addEventListener("click", () => {
    if (confirm("清空当前结果，重新答题？")) {
      STATE.currentQIdx = 0;
      for (let i = 0; i < STATE.total; i++) STATE.answers[i] = null;
      STATE.result = null;
      renderQuestion();
      showView("quiz");
    }
  });

  // ============================================================
  // 10. 启动：保证默认显示首页
  // ============================================================
  showView("landing");
})();
