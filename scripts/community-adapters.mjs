import {load} from 'cheerio';
import {clock24,namedDate,zonedTime} from './time.mjs';
import {safeUrl,DAY} from '../src/core.js';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const bopBase='https://www.themusicsettlement.org/';
const cancelled=s=>/\b(cancelled|canceled|postponed)\b/i.test(s);
function official(url,host){if(!safeUrl(url)||new URL(url).hostname!==host)throw Error('Unexpected official source URL');return url;}
function inWindow(date,now){return Date.parse(date+'T12:00:00Z')>=+now-DAY&&Date.parse(date+'T00:00:00Z')<=+now+45*DAY;}

export function bopCandidates(html,now=new Date()){
  const $=load(html),cards=$('a.event');
  if(!cards.length)throw Error('BOP STOP schedule structure missing');
  if(cards.length>12)throw Error('BOP STOP detail-page limit exceeded');
  return cards.toArray().flatMap(n=>{
    const item=$(n),title=clean(item.find('.title').text()),schedule=clean(item.find('.date').text());
    if(!title||!schedule)throw Error('Incomplete BOP STOP schedule card');
    if(cancelled(title)||/songwriter|private event/i.test(title))return [];
    const url=official(new URL(item.attr('href'),bopBase).href,'www.themusicsettlement.org');
    const date=namedDate(schedule),clock=schedule.match(/at (\d{1,2}:\d{2}\s*[ap]m)$/i);
    if(!clock||!url.includes('/events/'+date.replaceAll('-','/')+'/')||!title.endsWith('@ BOP STOP'))throw Error('BOP STOP index identity/date mismatch');
    return inWindow(date,now)?[{title,event_url:url,date,time:clock24(clock[1])}]:[];
  });
}
export function parseBopEvent(html,candidate,source){
  const $=load(html),area=$('#event-detail'),content=area.find('[id^="content-"]').first();
  if(!area.length||!content.length)throw Error('BOP STOP detail structure missing');
  const title=clean($('h1[itemprop="name"]').text());
  if(cancelled(title)||cancelled(clean(content.children('p').first().text())))return [];
  if(title!==candidate.title)throw Error('BOP STOP index/detail title mismatch');
  const startLocal=$('[itemprop="startDate"]').attr('content');
  if(startLocal!==candidate.date+'T'+candidate.time.slice(0,5))throw Error('BOP STOP index/detail date mismatch');
  // Only the event introduction establishes genre, never a venue footer or unrelated biography.
  const intro=clean(content.children('p').first().text());
  if(!/\bjazz\b|\bbebop\b|\bhard bop\b/i.test(title+' '+intro))return [];
  const promise=content.children('p').filter((i,n)=>/This event will also be livestreamed on BOP STOP.s/i.test($(n).text())&&/Accessing the stream is free but donations are encouraged/i.test($(n).text())).first();
  if(!promise.length)return [];
  const channel=promise.find('a').toArray().map(n=>$(n).attr('href')).find(h=>h==='https://www.youtube.com/@BOPSTOPTMS');
  if(!channel)throw Error('BOP STOP official viewing link missing or changed');
  const visible=clean($('p.dates[itemprop="startDate"]').text()),times=[...visible.matchAll(/\d{1,2}:\d{2}\s*[ap]m/gi)].map(m=>clock24(m[0]));
  const monthDay=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'long',day:'numeric'}).format(new Date(candidate.date+'T12:00:00Z'));
  if(!visible.startsWith(monthDay+' from ')||times.length!==2||times[0]!==candidate.time)throw Error('BOP STOP visible schedule mismatch');
  const start=zonedTime(startLocal+':00',source.timezone);
  let endDate=candidate.date;if(times[1]<=times[0])endDate=new Date(Date.parse(endDate+'T12:00:00Z')+DAY).toISOString().slice(0,10);
  return [{title:title.replace(/\s*@ BOP STOP$/,''),start,end:zonedTime(endDate+'T'+times[1],source.timezone),type:'Small ensemble',program:'Official BOP STOP jazz performance',free:true,jazz:true,access:'none',access_note:'Free livestream; donations are optional. In-person tickets are separate.',event_url:candidate.event_url,stream_url:channel,watch_kind:'channel',evidence:{stream:'The dated official event page announces a broadcast on the venue’s YouTube channel at showtime.',free:'The same event page explicitly confirms free stream access with optional donations.',stream_url:candidate.event_url,free_url:candidate.event_url}}];
}
export async function collectBop(get,source,now){
  const candidates=bopCandidates(await get(source.url),now),rows=[];
  for(const candidate of candidates)rows.push(...parseBopEvent(await get(candidate.event_url),candidate,source));
  return rows;
}

export function parseCityEvents(html,source,now=new Date()){
  const $=load(html),cards=$('.tribe-events-calendar-list__event');
  if(!cards.length)throw Error('City of Asylum schedule structure missing');
  if(cards.length>20)throw Error('City of Asylum event limit exceeded');
  return cards.toArray().flatMap(n=>{
    const item=$(n),link=item.find('.tribe-events-calendar-list__event-title-link'),title=clean(link.text());
    if(!title)throw Error('City of Asylum event title missing');
    if(!/\bjazz\b/i.test(title)||cancelled(title))return [];
    const free=item.find('.savv-events-custom__link').filter((i,n)=>clean($(n).text())==='Free Livestream Tickets');
    if(!free.length)return [];
    if(free.length!==1)throw Error('Ambiguous City of Asylum livestream link');
    const event_url=official(link.attr('href'),'cityofasylum.org');
    const stream_url=official(free.attr('href'),'cityofasylum.my.salesforce-sites.com');
    const date=item.find('time').attr('datetime');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Full City of Asylum date missing');
    const visible=clean(item.find('.tribe-event-date-start').text()),parts=visible.match(/^(.+) @ (\d{1,2}:\d{2}\s*[ap]m)$/i);
    const monthDay=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'long',day:'numeric'}).format(new Date(date+'T12:00:00Z'));
    if(!parts||parts[1]!==monthDay)throw Error('City of Asylum visible date mismatch');
    const start=zonedTime(date+'T'+clock24(parts[2]),source.timezone),end=zonedTime(date+'T'+clock24(clean(item.find('.tribe-event-time').text())),source.timezone);
    const zone=clean(item.find('.timezone').text()),expected=new Intl.DateTimeFormat('en-US',{timeZone:source.timezone,timeZoneName:'short'}).formatToParts(new Date(start)).find(p=>p.type==='timeZoneName').value;
    if(zone!==expected)throw Error('City of Asylum zone disagrees with date');
    if(!inWindow(date,now))return [];
    return [{title,start,end,type:/Sings|vocal/i.test(title)?'Vocal jazz':'Small ensemble',program:'Thursday Night Jazz at Alphabet City',free:true,jazz:true,access:'free-registration',access_note:'Reserve a free livestream ticket. In-person reservations are separate.',event_url,stream_url,watch_kind:'direct',evidence:{stream:'The official concert schedule supplies this event’s dated time and a dedicated livestream reservation link.',free:'That event’s livestream reservation is explicitly labeled free.',stream_url:source.url,free_url:source.url}}];
  });
}
export async function collectCity(get,source,now){return parseCityEvents(await get(source.url),source,now);}
