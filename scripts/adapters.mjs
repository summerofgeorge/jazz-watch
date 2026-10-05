import {load} from 'cheerio';
import {clock24,namedDate,zonedTime} from './time.mjs';
import {collectBop,collectCity} from './community-adapters.mjs';
const base='https://www.smallslive.com/';
export const clean=text=>String(text||'').replace(/\s+/g,' ').trim();
export function smallsCandidates(html,source) {
  const $=load(html),cards=$('article.event-display-today-and-tomorrow');
  if(!cards.length) {if(/no (upcoming )?shows scheduled/i.test($('section.event-stripe').text()))return [];throw Error('Smalls schedule structure changed');}
  const candidates=[];
  for(const card of cards.toArray()) {
    const item=$(card),venue=clean(item.find('.venue').text()),title=clean(item.find('.event-info-title').text());
    if(venue!=='Live at '+(source.id==='smalls'?'Smalls':'Mezzrow'))continue;
    if(/\b(cancelled|canceled|postponed|vinyl|private)\b/i.test(title))continue;
    const href=item.find('a[href^="/events/"]').first().attr('href');
    if(!href||!title)throw Error('Incomplete event card');
    candidates.push({title,event_url:new URL(href,base).href,artists:item.find('.artists-name').toArray().map(n=>clean($(n).text())),schedule:clean(item.find('.sub-info__date-time').text())});
  }
  const distinct=[...new Map(candidates.map(c=>[c.event_url,c])).values()];
  if(distinct.length>16)throw Error('Detail-page limit exceeded');
  return distinct;
}
export function freeSmallsPolicy(html) {
  const $=load(html),text=clean($('body').text());
  if(!/There is no charge to watch the live streams from Smalls and Mezzrow/i.test(text))throw Error('Free live-viewing policy missing or changed');
  return {free:'The official policy states that live broadcasts from both clubs have no viewing charge.',free_url:base+'livestream/'};
}
export function parseSmallsEvent(html,candidate,source,policy) {
  const $=load(html),area=$('.event-page-container');
  if(!area.length)throw Error('Event page structure changed');
  const live=clean(area.find('.event-overlay-venue').text())==='Live Now' && area.find('.player-container iframe[src^="https://www.ustream.tv/embed/"]').length>0;
  const title=clean($('.event-title-ajax').first().text()||area.find('.current-event.event-title.title1').first().text());
  const venue=clean($('.event-venue').first().text())||(live?'Live at '+(source.id==='smalls'?'Smalls':'Mezzrow'):'');
  if(!title)throw Error('Event identity missing');
  if(/\b(cancelled|canceled|postponed|private)\b/i.test(title+' '+clean(area.find('.event-subtitle').text())))return [];
  if(title!==candidate.title)throw Error('Index/detail identity mismatch');
  const promise=clean($('#streamingNotAvailableDialog .modal-body p').first().text());
  if(!/^This event will be streaming live (?:on \d{2}\/\d{2}\/\d{4} )?at /i.test(promise)&&!live)return [];
  if(venue!=='Live at '+(source.id==='smalls'?'Smalls':'Mezzrow'))throw Error('Index/detail venue mismatch');
  const date=namedDate($('meta[property="og:description"]').attr('content')||'');
  const announced=promise.match(/on (\d{2})\/(\d{2})\/(\d{4})/);
  if(announced&&date!==announced[3]+'-'+announced[1]+'-'+announced[2])throw Error('Broadcast date disagrees with event date');
  const display=clean($('.event-date').first().text())||(live?candidate.schedule.slice(0,10):'');
  const expected=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short',month:'short',day:'2-digit'}).format(new Date(date+'T12:00:00Z')).replaceAll(',','');
  if(display!==expected)throw Error('Visible and metadata dates disagree');
  const schedule=clean($('.event-sets').first().text())||(live?candidate.schedule.slice(10).trim():'');
  if(!candidate.schedule.includes(display)||!candidate.schedule.includes(schedule))throw Error('Index/detail schedule mismatch');
  const times=[...schedule.matchAll(/\d{1,2}:\d{2}\s*(?:AM|PM)/gi)].map(m=>clock24(m[0]));
  if(!times.length||times.length>3)throw Error('Missing or ambiguous set times');
  const isRange=/^From /i.test(schedule);
  if(isRange&&times.length!==2)throw Error('Malformed event time range');
  if(!isRange&&!/^Sets? at /i.test(schedule))throw Error('Unknown event schedule format');
  const promised=promise.match(/at (\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  if(!live&&(!promised||clock24(promised[1])!==times[0]))throw Error('Stream and performance clock disagree');
  const artists=candidate.artists, instruments=[...new Set(artists.map(a=>a.split('/').at(-1).trim()))];
  const type=/jam/i.test(title)?'Jam session':artists.some(a=>/vocal/i.test(a))?'Vocal jazz':/orchestra|big band/i.test(title)?'Big band':'Small ensemble';
  return (isRange?[times[0]]:times).map((time,index)=>{
    const start=zonedTime(date+'T'+time,source.timezone);
    let end=null;
    if(isRange){let endDate=date;if(times[1]<=times[0])endDate=new Date(Date.parse(date+'T12:00:00Z')+86400000).toISOString().slice(0,10);end=zonedTime(endDate+'T'+times[1],source.timezone);}
    return {title,start,end,type,artists,instruments,program:artists.join(' · '),set:!isRange?index+1:null,free:true,jazz:true,access:'none',access_note:'Live viewing is free. Paid venue tickets and archive memberships are separate.',event_url:candidate.event_url,stream_url:source.stream_url,watch_kind:'venue',evidence:{...policy,stream:'The dated official event page explicitly announces its live broadcast; the source schedule supplies the advertised set times.',stream_url:candidate.event_url}};
  });
}
async function collectClub(get,source) {
  const policy=freeSmallsPolicy(await get(base+'livestream/'));
  const candidates=smallsCandidates(await get(base),source),events=[];
  for(const candidate of candidates)events.push(...parseSmallsEvent(await get(candidate.event_url),candidate,source,policy));
  return events;
}
export const adapters={smalls:collectClub,mezzrow:collectClub,bop:collectBop,city:collectCity};
