import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from '../scripts/serve.mjs';
import {normalize} from '../scripts/model.mjs';
const output='work/qa';await mkdir(output,{recursive:true});
const production=JSON.parse(await readFile('dist/events.json','utf8'));
const browser=await chromium.launch(process.platform==='win32'?{channel:'msedge',headless:true}:{headless:true});
const pages=['index.html','sources.html','watch.html','about.html','coverage.html','support.html','404.html'],checks=[];
let server;
try{
 for(const prefix of ['', '/jazz-watch']){
  server=createServer({prefix});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
   const context=await browser.newContext({viewport:{width,height},timezoneId:'America/New_York'});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const file of pages){
    const response=await page.goto(origin+prefix+'/'+file);assert.equal(response.status(),200);
    if(file==='index.html')await page.waitForFunction(()=>document.querySelector('#loading').hidden);
    if(file==='sources.html')assert.doesNotMatch(await page.locator('main').textContent(),/research|review candidate/i);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,file+' horizontal overflow');
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],file+' accessibility');
    if(!prefix){await page.screenshot({path:output+'/'+name+'-'+file.replace('.html','.png'),fullPage:file!=='index.html'});if(file==='index.html'){await page.screenshot({path:output+'/'+name+'-calendar-viewport.png'});if(await page.locator('.event').count())await page.locator('.event').first().screenshot({path:output+'/'+name+'-set.png'});}}
    checks.push(name+' '+(prefix||'/')+' '+file+': layout + axe pass');
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  // Deterministic test-only data; never copied into dist.
  const context=await browser.newContext({viewport:{width:1100,height:900},timezoneId:'America/New_York'});
  const page=await context.newPage();await page.clock.setFixedTime(new Date('2026-10-04T18:00:00Z'));
  const source={id:'test',name:'Fixture Club',timezone:'America/New_York',source_type:'Club',region:'North America',country:'United States',city:'New York'};
  const raw={title:'Fixture Jazz Quartet',program:'Piano · Saxophone',start:'2026-10-04T22:00:00Z',event_url:'https://example.org/event',stream_url:'https://example.org/live',watch_kind:'venue',free:true,jazz:true,access:'none',type:'Small ensemble',evidence:{stream:'Fixture evidence',free:'Fixture free policy',stream_url:'https://example.org/event',free_url:'https://example.org/policy'}};
  const one=normalize(raw,source,'2026-10-04T17:00:00Z'),two=normalize({...raw,title:'Tomorrow Trio',start:'2026-10-05T22:00:00Z'},source,'2026-10-04T17:00:00Z');
  let dataset={...production,generated_at:'2026-10-04T17:00:00Z',events:[one,two],sources:[]};
  await page.route('**/events.json',r=>r.fulfill({json:dataset}));
  await page.goto(origin+prefix+'/index.html');await page.waitForFunction(()=>document.querySelector('#loading').hidden);
  assert.equal(await page.locator('.event').count(),2);
  await page.getByRole('button',{name:'Tonight',exact:true}).click();assert.equal(await page.locator('.event').count(),1);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.locator('#search').fill('never-present');assert.equal(await page.locator('.empty').count(),1);
  await page.getByRole('button',{name:'Reset filters',exact:true}).first().click();await page.locator('#search').fill('SAX');assert.equal(await page.locator('.event').count(),2);
  await page.getByRole('button',{name:'More filters',exact:true}).click();await page.locator('#zone').selectOption('Asia/Tokyo');assert.match(await page.locator('#timezone-note').textContent(),/Tokyo/);assert.match(page.url(),/zone=Asia%2FTokyo/);
  await page.locator('.evidence-toggle').first().click();assert.equal(await page.locator('.evidence').first().isVisible(),true);
  const promise=page.waitForEvent('download');await page.locator('#download').click();const download=await promise;const stream=await download.createReadStream();let ics='';for await(const part of stream)ics+=part.toString();assert.match(ics,/BEGIN:VCALENDAR/);assert.equal(ics.match(/BEGIN:VEVENT/g).length,2);
  await page.reload();await page.waitForFunction(()=>document.querySelector('#loading').hidden);assert.equal(await page.locator('#search').inputValue(),'SAX');assert.equal(await page.locator('#zone').inputValue(),'Asia/Tokyo');
  // Sharing retains source time and stable IDs, handles denied clipboard access, and restores focus.
  await page.getByRole('button',{name:'Share Fixture Jazz Quartet',exact:true}).click();
  const dialog=page.getByRole('dialog');assert.equal(await dialog.isVisible(),true);
  assert.match(await dialog.locator('[data-details]').textContent(),/America\/New_York/);
  const sharedLink=await dialog.locator('#share-url').inputValue();assert.equal(new URL(sharedLink).searchParams.get('event'),one.id);assert.equal(new URL(sharedLink).pathname,prefix+'/index.html');
  await dialog.locator('#share-message').fill('See you there! & <jazz>');
  assert.match(new URL(await dialog.locator('[data-email]').getAttribute('href')).searchParams.get('body'),/See you there! & <jazz>/);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied for test');}}}));
  await dialog.getByRole('button',{name:'Copy message & link',exact:true}).click();assert.equal(await dialog.locator('[data-copy-fallback]').isVisible(),true);assert.match(await dialog.locator('[data-copy-fallback]').inputValue(),/Fixture Jazz Quartet/);
  assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations,[]);
  if(!prefix)await page.screenshot({path:output+'/desktop-sharing.png'});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);if(!prefix)await page.screenshot({path:output+'/mobile-sharing.png'});
  await dialog.getByRole('button',{name:'Close',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Share Fixture Jazz Quartet',exact:true}).evaluate(e=>e===document.activeElement),true);
  await page.goto(sharedLink);await page.waitForFunction(()=>document.querySelector('#loading').hidden);assert.equal(await page.locator('.shared-event').count(),1);assert.equal(await page.locator('.shared-event').getAttribute('id'),one.id);
  await page.goto(origin+prefix+'/index.html?event=removed');await page.waitForFunction(()=>document.querySelector('#loading').hidden);assert.equal(await page.locator('#shared-notice').isVisible(),true);
  await page.goto(origin+prefix+'/support.html');await page.getByRole('button',{name:'Share an introduction',exact:true}).click();assert.match(await page.locator('#share-message').inputValue(),/George Mount/);assert.match(await page.locator('#share-message').inputValue(),/Stringfest Analytics/);await page.locator('[data-close]').click();
  await page.setViewportSize({width:1100,height:900});
  dataset={...dataset,events:[{...one,access:'free-registration',watch_kind:'direct'}]};await page.goto(origin+prefix+'/index.html');await page.waitForFunction(()=>document.querySelector('#loading').hidden);assert.equal(await page.getByRole('link',{name:'Reserve free stream',exact:true}).count(),1);assert.equal(await page.getByText('Free registration required',{exact:true}).count(),1);
  // Stale and expired snapshots must not silently remain current.
  dataset={...dataset,generated_at:'2026-09-30T00:00:00Z',events:[{...one,stale:true},{...two,last_verified_at:'2026-09-01T00:00:00Z'}]};
  await page.goto(origin+prefix+'/index.html');await page.waitForFunction(()=>document.querySelector('#loading').hidden);assert.equal(await page.locator('#data-warning').isVisible(),true);assert.equal(await page.locator('.event').count(),1);await page.locator('#fresh').check();assert.equal(await page.locator('.event').count(),0);
  dataset={...dataset,events:[{...one,title:'<img src=x onerror=alert(1)>',program:'<script>bad()</script>'}]};
  await page.goto(origin+prefix+'/index.html');await page.waitForFunction(()=>document.querySelector('#loading').hidden);assert.equal(await page.locator('.event img,.event script').count(),0);assert.match(await page.locator('.event h3').textContent(),/<img/);
  await page.unroute('**/events.json');await page.route('**/events.json',r=>r.fulfill({status:503,body:'Unavailable'}));await page.reload();await page.waitForFunction(()=>document.querySelector('#loading').getAttribute('role')==='alert');assert.equal(await page.locator('#download').isDisabled(),true);
  checks.push((prefix||'/')+': filters, timezone, URL restore, evidence, ICS, sharing, clipboard fallback, shared set links, support introduction, stale expiry, XSS safety, error state pass');
  await context.close();await new Promise(r=>server.close(r));server=null;
 }
 await writeFile(output+'/browser-results.json',JSON.stringify({checked_at:new Date().toISOString(),browser:browser.version(),checks,production_sets:production.events.length},null,2)+'\n');
 console.log(checks.join('\n'));console.log('Browser QA passed: 28 page/viewport/prefix audits and 2 interaction suites.');
}finally{if(server)await new Promise(r=>server.close(r));await browser.close();}
