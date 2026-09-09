/**
 * 首页：参考成熟个人作品站的信息架构，以项目、方法与文章呈现个人能力。
 */

import { site } from '../../shared/content/site.js';

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}
function formatDate(iso = '') {
  if (!iso) return '';
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function readTime(note = {}) {
  if (note.duration) return `${note.duration} 分钟`;
  return `${Math.max(1, Math.round(String(note.myUnderstanding || note.oneLiner || '').length / 450))} 分钟`;
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
  const projects = (ctx.work || []).filter((item) => item.kind === 'PROJECT').length;
  const notes = (ctx.notes || []).length;
  const tools = (ctx.toolbox || []).length;

  return `
    <section class="zh-hero">
      <div class="zh-container zh-hero-grid">
        <div class="zh-hero-copy">
          <p class="zh-pill"><span aria-hidden="true">&gt;_</span> AI PRODUCT / AGENT / BUILDING <i aria-hidden="true"></i></p>
          <h1>把 AI 想明白，<br>也把它做出来。</h1>
          <p class="zh-hero-lead">围绕 AI Evaluation、Agent 和真实产品场景，记录我如何拆解问题、搭建原型、验证结果，再把方法留给下一次使用。</p>

          <div class="zh-metrics" aria-label="内容概览">
            <div><strong>${projects || '03'}</strong><span>持续迭代的完整项目</span></div>
            <div><strong>${notes || 'AI'}</strong><span>来自实践的思考与文章</span></div>
            <div><strong>${tools || '0→1'}</strong><span>可复用的方法与工具</span></div>
          </div>

          <div class="zh-hero-actions">
            <a class="zh-button zh-button--primary" href="#/work">查看项目 <span aria-hidden="true">→</span></a>
            <a class="zh-button zh-button--secondary" href="#/notes">读最近文章 <span aria-hidden="true">&lt;/&gt;</span></a>
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
              <a class="zh-button zh-building-link" href="#/work/personal-knowledge-lab" aria-label="View Case Study：AI Learning OS">View Case Study <span aria-hidden="true">→</span></a>
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

function sectionIntro(label, title, desc = '') {
  return `
    <div class="zh-section-intro">
      <p class="zh-section-label"><span aria-hidden="true">⌁</span> ${label}</p>
      <h2>${title}</h2>
      ${desc ? `<p>${desc}</p>` : ''}
    </div>`;
}

function capabilitySection(about = {}) {
  const areas = [
    ...(about.focusAreas || []),
    {
      title: '持续发布',
      desc: '让项目、文章与工具互相连接，形成可以继续迭代的作品。'
    }
  ].slice(0, 5);

  return `
    <section class="zh-section" id="home-about">
      <div class="zh-container">
        ${sectionIntro(
          '现在关注什么',
          '把复杂的 AI 能力，放进清楚的产品场景。',
          '我更关心能力边界、工作流和验证方式，而不是给每个页面都加一个聊天框。'
        )}
        <ul class="zh-capability-grid">
          ${areas.map((area, index) => `
            <li>
              <span>0${index + 1}</span>
              <h3>${esc(area.title)}</h3>
              <p>${esc(area.desc)}</p>
            </li>`).join('')}
        </ul>
      </div>
    </section>`;
}

function projectsSection(work = []) {
  const items = work.slice(0, 4);
  if (!items.length) return '';

  return `
    <section class="zh-section zh-project-section" id="home-work">
      <div class="zh-container">
        ${sectionIntro(
          '代表项目',
          '先讲问题，再讲项目。',
          '这些项目不只展示结果，也保留关键选择、验证过程和我从中学到的东西。'
        )}
        <div class="zh-project-grid">
          ${items.map((item, index) => `
            <a class="zh-project-card" href="#/work/${esc(item.id)}">
              <div class="zh-project-card-top">
                <span>${esc(item.kindLabel || item.kind || 'PROJECT')}</span>
                <b>0${index + 1}</b>
              </div>
              <h3>${esc(item.title)}</h3>
              <p class="zh-project-question">${esc(item.problem || item.summary || '')}</p>
              <p class="zh-project-summary">${esc(item.summary || item.solution || '')}</p>
              <footer>
                <span>${esc(item.statusLabel || item.status || '查看项目')}</span>
                <b>查看项目 →</b>
              </footer>
            </a>`).join('')}
        </div>
        <a class="zh-button zh-button--small" href="#/work">查看全部项目 <span aria-hidden="true">→</span></a>
      </div>
    </section>`;
}

function methodsSection(toolbox = []) {
  const items = toolbox.slice(0, 6);
  if (!items.length) return '';

  return `
    <section class="zh-section zh-method-section" id="home-tools">
      <div class="zh-container zh-method-grid">
        <div>
          ${sectionIntro(
            '我如何工作',
            '小工具，也要边界清楚。',
            '把常用的判断方式、提示词和检查清单留下来，让下一次解决问题更直接。'
          )}
          <a class="zh-button zh-button--secondary zh-button--small" href="#/toolbox">浏览全部工具 <span aria-hidden="true">→</span></a>
        </div>
        <div class="zh-method-list">
          ${items.map((tool, index) => `
            <a href="#/toolbox/${esc(tool.id)}">
              <span>0${index + 1}</span>
              <div>
                <h3>${esc(tool.title)}</h3>
                <p>${esc(tool.problemSolved || tool.subtitle || '')}</p>
              </div>
              <b aria-hidden="true">↗</b>
            </a>`).join('')}
        </div>
      </div>
    </section>`;
}

function notesSection(notes = []) {
  const items = notes.slice(0, 3);
  if (!items.length) return '';

  return `
    <section class="zh-section" id="home-writing">
      <div class="zh-container">
        ${sectionIntro(
          '近期文章',
          '写下判断，也保留还没想清楚的地方。',
          '文章从具体项目和问题出发，记录方法、取舍与下一步验证方向。'
        )}
        <div class="zh-note-list">
          ${items.map((note, index) => `
            <a class="zh-note-card" href="#/notes/${esc(note.id)}">
              <div class="zh-note-main">
                <p class="zh-note-meta"><span>${formatDate(note.date)}</span><i></i><span>约 ${readTime(note)}</span></p>
                <h3>${esc(note.title)}</h3>
                <p>${esc(note.oneLiner || note.myTake || '')}</p>
                <span class="zh-note-tag">${esc(note.category || 'NOTE')}</span>
              </div>
              <aside>
                <span>note/</span>
                <strong>00${index + 1}</strong>
                <b>阅读全文 →</b>
              </aside>
            </a>`).join('')}
        </div>
        <a class="zh-button zh-button--small" href="#/notes">阅读全部文章 <span aria-hidden="true">→</span></a>
      </div>
    </section>`;
}

function closingSection() {
  return `
    <section class="zh-closing">
      <div class="zh-container">
        <div class="zh-closing-card">
          <div>
            <p>AI-READABLE PORTFOLIO</p>
            <h2>先看项目，<br>再看它们如何长成文章。</h2>
          </div>
          <div class="zh-closing-actions">
            <a class="zh-button zh-button--light" href="#/work">从项目开始 →</a>
            <a href="#/about">了解我正在做什么</a>
          </div>
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
        ${capabilitySection(ctx.about)}
        ${projectsSection(ctx.work)}
        ${methodsSection(ctx.toolbox)}
        ${notesSection(ctx.notes)}
        ${closingSection()}
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
