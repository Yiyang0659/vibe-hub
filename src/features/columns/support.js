export { esc } from '../../shared/components/content-detail.js';
import { esc } from '../../shared/components/content-detail.js';
export function safeText(value){if(!value)return '';if(Array.isArray(value))return '<ul>'+value.map(v=>`<li>${esc(typeof v==='string'?v:JSON.stringify(v))}</li>`).join('')+'</ul>';return `<p>${esc(String(value))}</p>`;}
