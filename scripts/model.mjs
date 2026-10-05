import {createHash} from 'node:crypto';
import {safeUrl,DAY,isExpired,validZone} from '../src/core.js';
export function validISO(value){
  const m=String(value).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/);
  if(!m||!Number.isFinite(Date.parse(value))||+m[2]>23||+m[3]>59||+m[4]>59)return false;
  if(m[5]!=='Z'&&(+m[5].slice(1,3)>14||+m[5].slice(4)>59||(+m[5].slice(1,3)===14&&+m[5].slice(4)!==0)))return false;
  return new Date(m[1]+'T12:00:00Z').toISOString().slice(0,10)===m[1];
}
export function normalize(raw,source,checkedAt) {
  if(raw.free!==true || raw.jazz!==true || !raw.evidence?.stream || !raw.evidence?.free || !safeUrl(raw.evidence?.stream_url)||!safeUrl(raw.evidence?.free_url)) throw Error('Affirmative jazz, livestream and free-viewing evidence required');
  if(!raw.title?.trim()||raw.title.length>300||/[<>]/.test(raw.title)) throw Error('Invalid title');
  if(!validISO(raw.start)) throw Error('Start requires a valid full date and explicit time zone');
  if(!validZone(source.timezone)) throw Error('Invalid source time zone');
  if(raw.end && (!validISO(raw.end)||Date.parse(raw.end)<=Date.parse(raw.start)||Date.parse(raw.end)-Date.parse(raw.start)>DAY)) throw Error('Invalid end');
  for(const key of ['event_url','stream_url']) if(!safeUrl(raw[key])) throw Error('Unsafe '+key);
  if(!['venue','direct','channel'].includes(raw.watch_kind)) throw Error('Unknown watch destination');
  if(!['none','free-registration'].includes(raw.access)) throw Error('Unknown or paid access');
  if(!validISO(checkedAt)) throw Error('Invalid verification date');
  const start=new Date(raw.start).toISOString(), id=source.id+'-'+createHash('sha256').update(raw.event_url+'|'+start).digest('hex').slice(0,20);
  return {...raw,id,start,end:raw.end?new Date(raw.end).toISOString():null,source:source.id,venue:source.name,source_type:source.source_type,region:source.region,country:source.country,city:source.city,timezone:source.timezone,last_verified_at:checkedAt,stale:false,review_method:raw.review_method||'automatic'};
}
export function mergeSource(previous,incoming,source,now,error=null) {
  const ageFilter=e=>!isExpired(e,now)&&Date.parse(e.start)<=+now+45*DAY&&(Date.parse(e.end||e.start)>=+now-2*DAY);
  const rows=error?previous.filter(e=>e.source===source.id).map(e=>({...e,stale:true})):incoming;
  const ids=new Map();
  for(const e of rows.filter(ageFilter)) { const prior=ids.get(e.id); if(prior && JSON.stringify(prior)!==JSON.stringify(e)) throw Error('Conflicting duplicate event'); ids.set(e.id,e); }
  return [...ids.values()];
}
export function reviewedEvents(registry,manual,now) {
  if(manual.schema_version!==1||!Array.isArray(manual.reviews)) throw Error('Invalid manual registry');
  const events=[],statuses=[];
  const seen=new Set();
  for(const review of manual.reviews) {
    const source=registry.sources.find(s=>s.id===review.source);
    if(!source||source.status==='excluded'||source.status==='active'||seen.has(source.id)) throw Error('Invalid or duplicate manual source');
    seen.add(source.id);
    if(!review.reviewer?.trim()||!Array.isArray(review.events)||!safeUrl(review.scope_url)) throw Error('Manual review metadata required');
    const age=+now-Date.parse(review.checked_at);
    if(!Number.isFinite(age)||age<0) throw Error('Invalid manual review time');
    if(age>=14*DAY) {statuses.push({source:source.id,status:'review_due',count:0,last_verified_at:review.checked_at});continue;}
    const normalized=review.events.map(e=>normalize({...e,review_method:'manual'},source,review.checked_at));
    const current=mergeSource([],normalized,source,now);
    events.push(...current);statuses.push({source:source.id,status:'manual',count:current.length,last_verified_at:review.checked_at});
  }
  return {events,statuses};
}
