import { icon } from '../learning/home-sections.js';
import { esc } from '../../shared/components/content-detail.js';
import { safeHref } from '../../shared/content/validation.js';
export const workKinds = { ALL: '全部', PROJECT: '项目', PROTOTYPE: '原型', EXPERIMENT: '小实验' };
export const projectIcon = (symbol='▤') => `<span class="pc-icon" aria-hidden="true">${symbol}</span>`;
export function projectMeta(item) {
  return `<div class="project-meta"><span class="project-status">${esc(item.statusLabel || workKinds[item.kind] || '项目')}</span>${(item.tags||[]).map(t=>`<span class="pc-tag">${esc(t)}</span>`).join('')}</div>`;
}
export function projectCover(item) {
  if(item.visual==='workflow')return `<div class="pc-visual pc-workflow"><h3>${icon('layers','green')}工作流全景图</h3><p>从输入到反馈，串联内容生产的每一步。</p><div class="pc-flow">${item.flow.map((s,i)=>`<div>${icon(["file","layers","cube","grid","book","code","refresh"][i],i%2?"blue":"green")}<strong>${esc(s)}</strong><small>${["主题 / 知识点 / 目标受众","课程资料 / 优秀案例","大纲生成 / 分段扩写","质量检查 / 评分建议","内容调整 / 最终确认","分镜 / 文案 / 平台格式","记录反馈 / 优化建议"][i]}</small></div>`).join('')}</div><div class="pc-loop">↳ 反馈回写 · 持续迭代 ↲</div><small>工作流方案示意</small></div>`;
  if(item.visual==='phone')return `<div class="pc-visual pc-phones" aria-label="小程序界面方案示意"><div class="pc-phone"><span>9:41 <b>•••</b></span><h3>滑一叠</h3><p>把生活拼成有趣的图卡</p><div class="pc-photo">☀<br><small>把日常，留成喜欢的样子。</small></div><div class="pc-faux-button">开始整理 →</div></div><div class="pc-phone"><h3>选择与整理</h3><div class="pc-photo-grid">${['穿搭','生活','日常','旅行','物品','灵感'].map(x=>`<div>${x}</div>`).join('')}</div><p>按主题整理图片</p><div class="pc-faux-button">下一步 →</div></div><div class="pc-phone"><h3>生成图卡</h3><div class="pc-photo">✦<br><small>新的一天<br>从喜欢的搭配开始。</small></div><p>预览图卡样式</p><div class="pc-faux-button">保存并分享</div></div><small class="pc-visual-caption">界面结构示意 · 非实际产品截图</small></div>`;
  if(item.visual==='learning')return `<div class="pc-visual pc-dashboard"><div class="pc-window-dots">● ● ●</div><h3>${projectIcon('▥')}AI Learning OS</h3><div class="pc-dashboard-banner"><div><strong>持续学习，<br>把过程认真留下来。</strong><p>THINK · BUILD · SHARE · GROW</p></div><img src="./assets/hero/person-hero.png" alt="桌前学习的人物插画"></div><div class="pc-dashboard-grid">${(item.modules||[]).map(([t,d],i)=>`<div>${projectIcon(['▱','▥','♧','↗'][i])}<strong>${t}</strong><small>${d}</small></div>`).join('')}</div><small>内容结构示意</small></div>`;
  const src=safeHref(item.screenshot);
  return src?`<figure class="project-cover"><img src="${esc(src)}" alt="${esc(item.title)}界面" loading="lazy"></figure>`:`<div class="pc-visual"><h3>${esc(item.title)}</h3><p>${esc(item.domain||'实践记录')}</p></div>`;
}
