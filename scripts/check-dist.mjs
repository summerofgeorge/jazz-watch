import {readFile,readdir,stat} from 'node:fs/promises';import {resolve} from 'node:path';import assert from 'node:assert/strict';import {load} from 'cheerio';import {normalize} from './model.mjs';import {safeUrl} from '../src/core.js';
const dir=resolve('dist'),files=await readdir(dir),expected=['.nojekyll','CNAME','404.html','about.html','app.js','analytics.js','core.js','coverage.html','events.json','index.html','logo-seal.png','logo-horizontal.png','share.js','social-card-v1.jpg','sources.html','styles.css','support.html','watch.html'];
assert.deepEqual(files.sort(),expected.sort(),'Unexpected deploy artifact files');
let bytes=0;for(const file of files){const content=await readFile(dir+'/'+file);bytes+=(await stat(dir+'/'+file)).size;
if(file.endsWith('.html')){
 const $=load(content.toString());assert.equal($('h1').length,1,file+' needs one main heading');assert.equal($('main').length,1);assert.ok($('html').attr('lang'));assert.ok($('title').text());assert.ok($('meta[name="viewport"]').length);
 for(const a of $('[href],[src]').toArray()){const url=$(a).attr('href')||$(a).attr('src');if(url.startsWith('https://')){assert.ok(safeUrl(url));continue;}if(url.startsWith('#'))continue;assert.ok(url.startsWith('./'),file+': paths must work under a project prefix: '+url);const target=new URL(url,'https://local.invalid/project/'+file);assert.ok(files.includes(target.pathname.split('/').at(-1)),file+': broken '+url);if(target.hash){const other=load(await readFile(dir+'/'+target.pathname.split('/').at(-1),'utf8'));assert.equal(other('[id="'+target.hash.slice(1)+'"]').length,1);}}
 assert.equal($('iframe').length,0,'No third-party embeds');assert.equal($('script[src^="https:"]').length,0,'No remote scripts');assert.ok(!/@ACTIVE_SOURCES@|@CANDIDATE_SOURCES@/.test(content.toString()));
}}
assert.ok(bytes<2_000_000,'Site exceeds 2 MB safety bound');
assert.equal((await readFile(dir+'/CNAME','utf8')).trim(),'jazzwatch.stringfestanalytics.com');
assert.doesNotMatch(await readFile(dir+'/sources.html','utf8'),/Research &amp; review|Research & review|Research candidate|@CANDIDATE_SOURCES@/i);
const data=JSON.parse(await readFile(dir+'/events.json','utf8')),registry=JSON.parse(await readFile('data/registry.json','utf8')),ids=new Set();
assert.equal(data.schema_version,1);assert.ok(Number.isFinite(Date.parse(data.generated_at)));
for(const e of data.events){assert.ok(!ids.has(e.id));ids.add(e.id);const source=registry.sources.find(s=>s.id===e.source);assert.ok(source);assert.equal(normalize(e,source,e.last_verified_at).id,e.id);assert.ok(!source.status.includes('excluded'));}
assert.ok(data.collection.requests<=60);console.log('dist validated: '+files.length+' files, '+bytes+' bytes, '+data.events.length+' evidence-backed sets; all local routes work at root and project paths.');
