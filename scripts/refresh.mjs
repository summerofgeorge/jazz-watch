import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {createFetcher} from './http.mjs';
import {adapters} from './adapters.mjs';
import {normalize,mergeSource,reviewedEvents} from './model.mjs';
const registry=JSON.parse(await readFile('data/registry.json','utf8'));
const manual=JSON.parse(await readFile('data/manual-reviewed.json','utf8'));
let previous={events:[]};try{previous=JSON.parse(await readFile('data/events.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const now=new Date(),get=createFetcher({allowedHosts:['www.smallslive.com','www.themusicsettlement.org','cityofasylum.org'],hostIntervals:{'www.smallslive.com':10000,'www.themusicsettlement.org':1500,'cityofasylum.org':1500}});
const events=[],statuses=[];
for(const source of registry.sources.filter(s=>s.status==='active')){
  const before=get.stats(),started=Date.now();
  try{
    const rows=(await adapters[source.adapter](get,source,now)).map(e=>normalize(e,source,now.toISOString()));
    const current=mergeSource(previous.events,rows,source,now);events.push(...current);
    statuses.push({source:source.id,status:'healthy',count:current.length,last_verified_at:now.toISOString(),requests:get.stats().requests-before.requests,duration_ms:Date.now()-started});
  }catch(error){
    const retained=mergeSource(previous.events,[],source,now,error);events.push(...retained);
    statuses.push({source:source.id,status:retained.length?'stale':'failed',count:retained.length,error:error.message,requests:get.stats().requests-before.requests,duration_ms:Date.now()-started});
  }
}
const reviewed=reviewedEvents(registry,manual,now);events.push(...reviewed.events);statuses.push(...reviewed.statuses);
const payload={schema_version:1,generated_at:now.toISOString(),lookahead_days:45,stale_after_days:14,scope:'Selective free jazz livestreams; source publishing windows vary.',collection:get.stats(),sources:statuses,events:events.sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id))};
await mkdir('data',{recursive:true});await writeFile('data/events.json.tmp',JSON.stringify(payload,null,2)+'\n');await rename('data/events.json.tmp','data/events.json');
console.log(JSON.stringify({events:events.length,sources:statuses,collection:payload.collection},null,2));
if(process.env.GITHUB_STEP_SUMMARY)await writeFile(process.env.GITHUB_STEP_SUMMARY,'## Jazz Watch refresh\n\n'+statuses.map(s=>'- '+s.source+': '+s.status+'; '+s.count+' sets'+(s.error?' — '+s.error:'')).join('\n')+'\n\nRequests: '+payload.collection.requests+'/60. Bytes: '+payload.collection.response_bytes+'.\n',{flag:'a'});
