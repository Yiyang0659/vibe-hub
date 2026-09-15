import * as content from '../../src/features/index.js';
import * as topics from '../../src/features/topics/index.js';
import * as glossary from '../../src/features/topics/glossary-notes.js';
import * as courses from '../../src/features/topics/course-data.js';
import * as projects from '../../src/features/work/entries.js';
import * as notes from '../../src/features/notes/entries.js';
import {translations} from '../../src/app/language.js';
import fs from 'node:fs';
const all=new Set();
function walk(v){if(typeof v==='string'&&/[\u4e00-\u9fff]/.test(v)&&!translations[v])all.add(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);}
[content,topics,glossary,courses,projects,notes].forEach(walk);
fs.writeFileSync(process.argv[2] || '/tmp/vibe-translation-corpus.json',JSON.stringify([...all],null,2));
console.log(all.size,[...all].join('').length);
