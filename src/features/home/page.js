import { isPublished } from '../../shared/content/validation.js';
import { homeLearningSections } from '../learning/home-sections.js';
/**
 * 首页：参考成熟个人作品站的信息架构，以项目、方法与文章呈现个人能力。
 */

import { site } from '../../shared/content/site.js';

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}
function characterHtml() {
  return `
    <div class="h-character-stage" aria-label="可互动的个人插画">
      <div class="h-character-art">
        <img class="h-character-image" src="./assets/hero/person-hero.png" alt="戴眼镜、穿连帽外套，在电脑前思考的手绘人物" decoding="async" fetchpriority="high">
        <img class="h-character-leaves" src="./assets/hero/person-hero.png" alt="" aria-hidden="true" decoding="async">
        <span class="h-character-companion" aria-hidden="true">
          <span class="h-pet-motion">
            <span class="h-pet-raster h-pet-raster--body">
              <img src="./assets/hero/person-hero.png" alt="" decoding="async">
            </span>
            <span class="h-pet-raster h-pet-raster--hands">
              <img src="./assets/hero/person-hero.png" alt="" decoding="async">
            </span>
            <span class="h-pet-face" data-expression="neutral">
              <span class="h-pet-expression h-pet-expression--neutral">
                <i class="h-pet-eye h-pet-eye--left"></i>
                <i class="h-pet-eye h-pet-eye--right"></i>
                <b class="h-pet-mouth"></b>
              </span>
              <span class="h-pet-expression h-pet-expression--happy">
                <i class="h-pet-happy-eye h-pet-happy-eye--left"></i>
                <i class="h-pet-happy-eye h-pet-happy-eye--right"></i>
                <b class="h-pet-happy-mouth"></b>
              </span>
              <span class="h-pet-expression h-pet-expression--surprised">
                <i class="h-pet-surprised-eye h-pet-surprised-eye--left"></i>
                <i class="h-pet-surprised-eye h-pet-surprised-eye--right"></i>
                <b class="h-pet-surprised-mouth"></b>
              </span>
              <span class="h-pet-expression h-pet-expression--wink">
                <i class="h-pet-wink-eye"></i>
                <i class="h-pet-eye h-pet-eye--right"></i>
                <b class="h-pet-mouth"></b>
              </span>
            </span>
          </span>
        </span>
        <span class="h-raster-eye h-raster-eye--left" aria-hidden="true"><i></i></span>
        <span class="h-raster-eye h-raster-eye--right" aria-hidden="true"><i></i></span>
      <button class="h-orb" type="button" aria-label="和 AI 小助手互动" aria-describedby="h-companion-message">
        <span class="h-orb-symbol" aria-hidden="true">✦</span>
      </button>
      </div>
      <p class="h-companion-message" id="h-companion-message" aria-live="polite">移动鼠标，它会注意到你。</p>
    </div>`;
}

function heroHtml(ctx) {
  const concepts = (ctx.lessons || []).filter(isPublished).length;
  const notes = (ctx.notes || []).filter(isPublished).length;
  const tools = (ctx.toolbox || []).filter(isPublished).length;

  return `
    <section class="zh-hero">
      <div class="zh-container zh-hero-grid">
        <div class="zh-hero-copy">
          <p class="zh-pill"><span aria-hidden="true">&gt;_</span> AI PRODUCT / AGENT / BUILDING <i aria-hidden="true"></i></p>
          <h1>把 AI 想明白，<br>也把它做出来。</h1>
          <p class="zh-hero-lead">记录学习 AI、产品和开发时遇到的问题，把逐渐弄懂的概念、动手尝试的过程，以及有用的小工具整理在这里。</p>

          <div class="zh-hero-actions">
            <a class="zh-button zh-button--primary" href="#/learning">浏览学习记录 <span aria-hidden="true">→</span></a>
            <a class="zh-button zh-button--secondary" href="#/work">看看我的实践 <span aria-hidden="true">&lt;/&gt;</span></a>
          </div>

          <div class="zh-metrics" aria-label="内容概览">
            <div><strong>${concepts}</strong><span>整理中的知识条目</span></div>
            <div><strong>${notes}</strong><span>理解与学习记录</span></div>
            <div><strong>${tools}</strong><span>小工具与复用方法</span></div>
          </div>

        </div>

        <div class="zh-hero-side">
          <section class="zh-visual-card" aria-labelledby="currently-building-title">
            <div class="zh-window-bar">
              <span class="zh-window-dots" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>&gt; currently-building</span>
              <b>interactive</b>
            </div>
            <div class="zh-building-copy">
              <h2 id="currently-building-title">AI Learning OS</h2>
              <p class="zh-building-description">正在把零散的 AI、产品和开发学习，整理成一个能够持续积累、实践和复盘的个人知识系统。</p>
              <p class="zh-building-status"><span aria-hidden="true">↗</span> BUILDING · 2026</p>
              <div class="zh-desk-note">
                <svg class="zh-desk-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <path d="M16 11c-3-3-8-3-12-2v17c4-1 9-1 12 2 3-3 8-3 12-2v-9M16 11v17M8 14h4M8 18h4" />
                  <path d="m20 14 1-5 6-6 3 3-6 6-4 2ZM25 5l3 3" />
                </svg>
                <div><h3>想与做的书桌</h3><p>把问题摆上桌，<br>把想法一点点做出来。</p></div>
              </div>
            </div>
            ${characterHtml()}
          </section>

          <div class="zh-principles">
            <div>
              <span aria-hidden="true">⌁</span>
              <strong>从问题开始</strong>
              <p>先说清楚为什么做，再决定用不用 AI。</p>
            </div>
            <div>
              <span aria-hidden="true">◇</span>
              <strong>让结果可验证</strong>
              <p>用原型、测试、数据和复盘验证结果，而不是只展示概念。</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

function aboutSection() {
  const entries = [
    { name: '知识与学习笔记', route: 'learning', tone: 'green', description: '从一个没弄懂的问题开始，记录理解、判断与复盘。', icon: '<path d="M14 21H5V3h14v9M9 8h6M9 12h4M9 16h2m4 5 1-4 5-5 3 3-5 5-4 1Z"/>' },
    { name: '项目与实验', route: 'work', tone: 'blue', description: '把想法做成原型或实际应用，留下过程、取舍和验证结果。', icon: '<path d="M6 3h9l5 5v13H6ZM15 3v6h5"/>' },
    { name: '工具与方法', route: 'toolbox', tone: 'purple', description: '把实践中有用的提示词、清单和流程整理下来，方便再次使用。', icon: '<path d="M9 5H5v17h15V5h-4M9 3h7v5H9Zm0 12 3 3 5-6"/>' }
  ];
  return `
    <section class="zh-section zh-about-section" id="home-about" aria-labelledby="home-about-title">
      <div class="zh-container zh-about-layout">
        <div class="zh-about-copy">
          <p class="zh-pill"><span aria-hidden="true">&gt;_</span> 关于我与这里 <i aria-hidden="true"></i></p>
          <h2 id="home-about-title">在学习 AI 的路上，<br>把过程认真留下来。</h2>
          <p class="zh-about-intro">我把学习 AI 时遇到的问题、动手做过的实验，以及实践后的复盘记录在这里。有些已经得到验证，有些还在探索，内容也会随着理解持续更新。</p>
          <a class="zh-button zh-about-more" href="#/about">了解更多关于我 <span aria-hidden="true">→</span></a>
          <img class="zh-about-art" src="./assets/hero/learning-desk.png" alt="戴眼镜的学习者坐在书桌前记录想法，身旁有电脑、书本、绿植和休息的小宠物" loading="lazy" decoding="async">
        </div>
        <div class="zh-content-guide">
          <header><h3><span aria-hidden="true"></span>这里记录了什么</h3><p>理解问题 <span aria-hidden="true">→</span> 动手尝试 <span aria-hidden="true">→</span> 记录复盘</p></header>
          <ul>${entries.map(entry => `
            <li><a class="zh-guide-row zh-guide-row--${entry.tone}" href="#/${entry.route}">
              <span class="zh-guide-icon" aria-hidden="true"><svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false">${entry.icon}</svg></span>
              <h4>${entry.name}</h4><p>${entry.description}</p><span class="zh-guide-arrow" aria-hidden="true">→</span>
            </a></li>`).join('')}
          </ul>
        </div>
      </div>
    </section>`;
}

function footerHtml() {
  return `
    <footer class="zh-footer">
      <div class="zh-container">
        <div class="zh-terminal">
          <p>$ status ${esc(site.name.toLowerCase())}</p>
          <span>状态：<b>持续构建</b></span>
          <span>方向：AI Product / Agent / Engineering</span>
        </div>
        <div class="zh-footer-bottom">
          <p>© ${new Date().getFullYear()} ${esc(site.name)} · Built with curiosity & AI.</p>
          <div>
            ${site.footerLinks.map((link) => `<a href="${esc(link.href)}"${link.href.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>${esc(link.label)}</a>`).join('')}
          </div>
        </div>
      </div>
    </footer>`;
}

export function renderHomeView(ctx) {
  return `
    <article class="home-view">
      <div class="home-main">
        ${heroHtml(ctx)}
        ${aboutSection()}
        ${homeLearningSections(ctx)}
      </div>
      ${footerHtml()}
    </article>`;
}

let disposeHome = null;

export function unmountHomeView() {
  disposeHome?.();
  disposeHome = null;
}

export function mountHomeView() {
  unmountHomeView();

  const stage = document.querySelector('.h-character-stage');
  const orb = stage?.querySelector('.h-orb');
  const companion = stage?.querySelector('.h-character-companion');
  const petFace = stage?.querySelector('.h-pet-face');
  const character = stage?.querySelector('.h-character-art');
  const message = stage?.querySelector('.h-companion-message');

  if (!stage || !orb || !companion || !character) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const messages = [
    ['✦', '它把一个想法捡了回来。'],
    ['{ }', '这个可以先做成一个小实验。'],
    ['✓', '做完以后，再回来验证一次。']
  ];

  let messageIndex = 0;
  let frame = 0;
  let running = true;
  let eyeTargetX = 0;
  let eyeTargetY = 0;
  let eyeX = 0;
  let eyeY = 0;
  let companionTargetX = 0;
  let companionTargetY = 0;
  let companionX = 0;
  let companionY = 0;
  let companionVelocityX = 0;
  let companionVelocityY = 0;
  let expressionTimer = 0;
  let waveTimer = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const setLook = (clientX, clientY) => {
    const rect = stage.getBoundingClientRect();
    const centerX = rect.left + rect.width * .53;
    const centerY = rect.top + rect.height * .48;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const reach = Math.min(1, distance / Math.max(rect.width, rect.height) * 1.35);
    const nx = clamp(dx / distance * reach, -1, 1);
    const ny = clamp(dy / distance * reach, -1, 1);
    eyeTargetX = nx * 3.2;
    eyeTargetY = ny * 2.4;
    companionTargetX = nx * 3.2;
    companionTargetY = ny * 2.4;
  };

  const resetLook = () => {
    eyeTargetX = 0;
    eyeTargetY = 0;
    companionTargetX = 0;
    companionTargetY = 0;
  };

  const animate = () => {
    if (!running || !stage.isConnected) return;

    if (reduceMotion.matches) {
      eyeX = eyeTargetX;
      eyeY = eyeTargetY;
      companionX = companionTargetX;
      companionY = companionTargetY;
    } else {
      eyeX += (eyeTargetX - eyeX) * .14;
      eyeY += (eyeTargetY - eyeY) * .14;
      companionVelocityX = (companionVelocityX + (companionTargetX - companionX) * .075) * .78;
      companionVelocityY = (companionVelocityY + (companionTargetY - companionY) * .075) * .78;
      companionX += companionVelocityX;
      companionY += companionVelocityY;
    }

    character.style.setProperty('--look-x', `${eyeX.toFixed(2)}px`);
    character.style.setProperty('--look-y', `${eyeY.toFixed(2)}px`);
    companion.style.setProperty('--pet-x', `${companionX.toFixed(2)}px`);
    companion.style.setProperty('--pet-y', `${companionY.toFixed(2)}px`);
    companion.style.setProperty('--pet-tilt', `${(companionX * .06).toFixed(2)}deg`);
    companion.style.setProperty('--pet-look-x', `${(eyeX * .42).toFixed(2)}px`);
    companion.style.setProperty('--pet-look-y', `${(eyeY * .34).toFixed(2)}px`);
    frame = requestAnimationFrame(animate);
  };

  const expressionNames = ['neutral', 'happy', 'surprised', 'wink'];

  const setExpression = (name, wave = false) => {
    if (!petFace) return;
    petFace.dataset.expression = name;
    if (!wave || reduceMotion.matches) return;
    companion.classList.remove('is-wave');
    void companion.offsetWidth;
    companion.classList.add('is-wave');
    clearTimeout(waveTimer);
    waveTimer = window.setTimeout(() => companion.classList.remove('is-wave'), 900);
  };

  const scheduleExpression = () => {
    clearTimeout(expressionTimer);
    expressionTimer = window.setTimeout(() => {
      if (!running || !stage.isConnected) return;
      onOrbClick();
      scheduleExpression();
    }, 5000);
  };

  const onOrbClick = () => {
    const [symbol, text] = messages[messageIndex % messages.length];
    messageIndex += 1;
    const symbolEl = orb.querySelector('.h-orb-symbol');
    if (symbolEl) symbolEl.textContent = symbol;
    if (message) message.textContent = text;
    setExpression(expressionNames[messageIndex % expressionNames.length], true);
    stage.classList.remove('is-pop');
    void stage.offsetWidth;
    stage.classList.add('is-pop');
  };

  const onPointerMove = (event) => setLook(event.clientX, event.clientY);
  const onPointerLeave = () => resetLook();

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('blur', onPointerLeave);
  orb.addEventListener('click', onOrbClick);
  frame = requestAnimationFrame(animate);
  scheduleExpression();

  disposeHome = () => {
    running = false;
    cancelAnimationFrame(frame);
    clearTimeout(expressionTimer);
    clearTimeout(waveTimer);
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', onPointerLeave);
    orb.removeEventListener('click', onOrbClick);
  };
}
