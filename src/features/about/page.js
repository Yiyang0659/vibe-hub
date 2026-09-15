import { renderColumnIntro } from '../columns/intro.js';
import { icon } from '../learning/home-sections.js';

const methods = [
  ['bulb', '理解问题', '先弄清概念、边界和真正要解决的问题。'],
  ['code', '动手尝试', '把想法做成原型，在使用中检验理解。'],
  ['book', '记录复盘', '留下判断、取舍与结果，方便下一次回看。'],
];

export function renderAboutPage() {
  return `<article class="ab-page site-container">
    ${renderColumnIntro('about')}
    <section class="ab-section" id="about-methods" aria-labelledby="ab-why"><header class="ab-section-heading"><h2 id="ab-why">为什么把过程留下来</h2><p>有些理解已经得到验证，有些还在探索。记录让每一次尝试都有迹可循。</p></header>
      <div class="ab-methods">${methods.map(([symbol,title,description],i)=>`<article class="ab-method"><span class="ab-number" aria-hidden="true">0${i+1}</span>${icon(symbol)}<h3>${title}</h3><p>${description}</p></article>`).join('')}</div>
    </section>
    <section class="ab-section" aria-labelledby="ab-explore"><header class="ab-section-heading"><h2 id="ab-explore">从这里继续了解我</h2></header>
      <nav class="ab-links" aria-label="继续了解我"><a href="#/projects">${icon('cube')}<div><h3>项目与实验</h3><p>看看我做过什么，以及过程中的取舍。</p></div><span aria-hidden="true">→</span></a><a href="#/learning?kind=NOTE">${icon('file')}<div><h3>思考与复盘</h3><p>阅读学习中的判断、问题和阶段性总结。</p></div><span aria-hidden="true">→</span></a></nav>
    </section>
    <nav class="ab-more" aria-label="更多个人介绍"><a href="#/about/me">建站的缘由 →</a><a href="#/about/now">现在在做什么 →</a></nav>
    <footer class="ab-footer">${icon('book')}<span>想与做 · 持续学习，认真记录。</span></footer>
  </article>`;
}
