import fs from 'node:fs';
import {topicsWithDomain} from '../../src/features/topics/index.js';
const data=JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
// Use the site's existing terminology rather than machine-translated labels.
for(const topic of topicsWithDomain)if(topic.english && !/[\u4e00-\u9fff]/.test(topic.english) && /[\u4e00-\u9fff]/.test(topic.title))data[topic.title]=topic.english;
fs.writeFileSync(new URL('../../src/shared/content/english.js',import.meta.url),'// Local machine-translated content. Reviewed UI and prose overrides live in src/app/language.js.\nexport const englishContent = '+JSON.stringify(data,null,2)+';\n');
console.log('Packaged',Object.keys(data).length,'English strings');
