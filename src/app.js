import {filterEvents,dayKey,statusLabel,makeICS,safeUrl,validZone,DAY} from './core.js';
const $=s=>document.querySelector(s);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function link(text,url,cls){const a=el('a',text,cls);a.href=safeUrl(url)||'#';return a;}
function download(rows){const blob=new Blob([makeICS(rows)],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='jazz-watch.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
let payload,shown=[],zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
const params=new URLSearchParams(location.search);
if(params.get('zone')&&validZone(params.get('zone')))zone=params.get('zone');
function currentFilters(){return Object.fromEntries(['search','venue','source_type','region','country','type','watch_kind','access'].map(k=>[k,$('#'+k)?.value||'']).concat([['period',$('[data-period][aria-pressed=true]')?.dataset.period||'all'],['fresh',$('#fresh').checked]]));}
function persist(){const f=currentFilters(),q=new URLSearchParams();for(const [k,v] of Object.entries(f))if(v&&v!=='all')q.set(k,String(v));q.set('zone',zone);history.replaceState(null,'',location.pathname+'?'+q.toString());}
function render(){
  const now=new Date();shown=filterEvents(payload.events,currentFilters(),now,zone);
  $('#results').replaceChildren();$('#result-count').textContent=shown.length+' '+(shown.length===1?'set':'sets')+' to explore';$('#download').disabled=!shown.length;
  $('#timezone-note').textContent='Times shown in '+zone.replaceAll('_',' ');
  const old=now-Date.parse(payload.generated_at)>2*DAY;
  $('#data-warning').hidden=!old;$('#data-warning').textContent='This calendar has not refreshed for more than two days. Check the official pages before making plans. Verification expires after 14 days.';
  if(!shown.length){const box=el('section',undefined,'empty');box.append(el('h2','A quiet moment in the calendar.'),el('p',payload.events.length?'No verified sets match these filters. Try another date or venue. Expired listings are automatically hidden.':'No current free jazz broadcasts have been verified. Explore the source directory and check back after the next refresh.'));const reset=el('button','Reset filters','button secondary');reset.addEventListener('click',resetFilters);box.append(reset);$('#results').append(box);return;}
  let lastDay='',list;
  for(const e of shown){
    const date=new Date(e.start),key=dayKey(date,zone);
    if(key!==lastDay){const group=el('section',undefined,'day'),heading=el('h2');heading.append(el('span',new Intl.DateTimeFormat('en',{timeZone:zone,weekday:'long'}).format(date)),el('b',new Intl.DateTimeFormat('en',{timeZone:zone,day:'numeric'}).format(date)),el('span',new Intl.DateTimeFormat('en',{timeZone:zone,month:'long',year:'numeric'}).format(date)));list=el('div',undefined,'events');group.append(heading,list);$('#results').append(group);lastDay=key;}
    const article=el('article',undefined,'event');article.id=e.id;
    const clock=el('div'),time=el('time',new Intl.DateTimeFormat('en',{timeZone:zone,hour:'numeric',minute:'2-digit'}).format(date));time.dateTime=e.start;clock.append(time,el('div',statusLabel(e,now),'schedule-status'));
    const info=el('div');info.append(el('p',e.venue+' · '+e.city,'venue'),el('h3',e.title+(e.set?' · Set '+e.set:'')),el('p',e.program,'program'));
    const tags=el('div',undefined,'tags');tags.append(el('span','Free to watch','tag free'),el('span',e.type,'tag'));if(e.stale)tags.append(el('span','Stale · recheck','tag stale'));if(e.review_method==='manual')tags.append(el('span','Manually reviewed','tag'));if(e.access==='free-registration')tags.append(el('span','Free registration required','tag'));
    info.append(tags,el('p','At the source: '+new Intl.DateTimeFormat('en',{timeZone:e.timezone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(date),'source-time'));
    const sourceLinks=el('div',undefined,'source-links');sourceLinks.append(link('Official event',e.event_url));const evidenceButton=el('button','Viewing evidence','text-button evidence-toggle');evidenceButton.setAttribute('aria-expanded','false');evidenceButton.setAttribute('aria-controls','evidence-'+e.id);sourceLinks.append(evidenceButton);info.append(sourceLinks);
    const actions=el('div',undefined,'event-actions');actions.append(link(e.access==='free-registration'?'Reserve free stream':e.watch_kind==='direct'?'Watch this set':e.watch_kind==='channel'?'Open channel':'Open live player',e.stream_url,'button'));
    const save=el('button','Add to calendar','button secondary');save.addEventListener('click',()=>download([e]));actions.append(save,el('small',e.access==='free-registration'?'Free livestream registration.':e.watch_kind==='venue'?'Venue player · select the right club.':e.watch_kind==='channel'?'Official channel · find the scheduled show.':'Official broadcast page.'));
    const evidence=el('div',undefined,'evidence');evidence.id='evidence-'+e.id;evidence.hidden=true;evidence.append(el('p',e.evidence.stream),link('Broadcast evidence',e.evidence.stream_url),el('p',e.evidence.free),link('Free-viewing policy',e.evidence.free_url),el('p','Verified '+new Date(e.last_verified_at).toLocaleString()+'. '+e.access_note+(e.end?'':' Calendar duration is estimated at 90 minutes.')));
    evidenceButton.addEventListener('click',()=>{evidence.hidden=!evidence.hidden;evidenceButton.setAttribute('aria-expanded',String(!evidence.hidden));});
    article.append(clock,info,actions,evidence);list.append(article);
  }
}
function resetFilters(){for(const field of ['search','venue','source_type','region','country','type','watch_kind','access'])$('#'+field).value='';$('#fresh').checked=false;for(const b of document.querySelectorAll('[data-period]'))b.setAttribute('aria-pressed',String(b.dataset.period==='all'));persist();render();}
async function main(){
  try{
    const response=await fetch('./events.json',{cache:'no-cache'});if(!response.ok)throw Error('Calendar data unavailable');payload=await response.json();if(payload.schema_version!==1||!Array.isArray(payload.events))throw Error('Calendar format changed');
    for(const k of ['venue','source_type','region','country','type','watch_kind','access']){
      const select=$('#'+k);const labels={venue:'All venues',source_type:'All source types',region:'All regions',country:'All countries',type:'All jazz formats',watch_kind:'All viewing links',access:'All free access'};
      select.replaceChildren(new Option(labels[k],''));for(const v of [...new Set(payload.events.map(e=>e[k]))].sort())select.add(new Option(({none:'No registration','free-registration':'Free registration',venue:'Venue player',direct:'Event link',channel:'Official channel'})[v]||v,v));
      if(params.has(k))select.value=params.get(k);select.addEventListener('change',()=>{persist();render();});
    }
    $('#search').value=params.get('search')||'';$('#search').addEventListener('input',()=>{persist();render();});
    $('#fresh').checked=params.get('fresh')==='true';$('#fresh').addEventListener('change',()=>{persist();render();});
    const zones=[zone,'UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo','Australia/Sydney',...(Intl.supportedValuesOf?.('timeZone')||[])];
    for(const z of [...new Set(zones)])$('#zone').add(new Option(z.replaceAll('_',' '),z));$('#zone').value=zone;
    $('#zone').addEventListener('change',()=>{zone=$('#zone').value;persist();render();});
    for(const button of document.querySelectorAll('[data-period]')){if(params.has('period'))button.setAttribute('aria-pressed',String(button.dataset.period===params.get('period')));button.addEventListener('click',()=>{document.querySelectorAll('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));persist();render();});}
    $('#reset').addEventListener('click',resetFilters);$('#download').addEventListener('click',()=>download(shown));$('#more-filters').addEventListener('click',()=>{const open=$('#extra-filters').hidden;$('#extra-filters').hidden=!open;$('#more-filters').setAttribute('aria-expanded',String(open));$('#more-filters').textContent=open?'Fewer filters':'More filters';});
    $('#updated').textContent='Last refresh '+new Date(payload.generated_at).toLocaleString();
    const status=$('#source-status');for(const s of payload.sources)status.append(el('li',s.source+': '+s.status+' · '+s.count+' verified sets'+(s.error?' · refresh needs attention':'')));
    $('#loading').hidden=true;render();setInterval(render,60000);
  }catch(error){$('#loading').textContent='The calendar could not load. Reload this page, or use the source directory to visit the official schedules.';$('#loading').setAttribute('role','alert');$('#download').disabled=true;}
}
main();
