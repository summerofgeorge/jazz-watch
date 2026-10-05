import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import {safeUrl,isExpired} from '../src/core.js';
import {publicSources} from './source-directory.mjs';
const registry=JSON.parse(await readFile('data/registry.json','utf8')), data=JSON.parse(await readFile('data/events.json','utf8'));
if(data.schema_version!==1||!Array.isArray(data.events))throw Error('Invalid data');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(s){if(!safeUrl(s.url)||!safeUrl(s.evidence_url))throw Error('Unsafe registry link');return '<article class="source-card"><span class="state">'+esc(s.status==='active'?'Daily source checks':'Manually verified source')+'</span><h2>'+esc(s.name)+'</h2><p class="place">'+esc(s.city+' · '+s.country+' · '+s.source_type)+'</p><p>'+esc(s.assessment)+'</p>'+(s.scope?'<p>'+esc(s.scope)+'</p>':'')+'<a href="'+esc(s.evidence_url)+'">Official source & evidence</a></article>';}
await mkdir('dist',{recursive:true});
for(const file of await readdir('src')){if(file.endsWith('.html')){let text=await readFile('src/'+file,'utf8');text=text.replace('@ACTIVE_SOURCES@',publicSources(registry,data).map(card).join(''));await writeFile('dist/'+file,text);}else await copyFile('src/'+file,'dist/'+file);}
const now=new Date(),visible={...data,events:data.events.filter(e=>!isExpired(e,now))};
await writeFile('dist/events.json',JSON.stringify(visible,null,2)+'\n');
await writeFile('dist/.nojekyll','');
console.log('Built '+(await readdir('dist')).length+' files; '+visible.events.length+' unexpired sets. No source timestamps renewed.');
