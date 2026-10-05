export const DAY = 86400000;
export const MAX_AGE_DAYS = 14;
export function safeUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') ? u.href : null; } catch { return null; }
}
export function dayKey(date, zone) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone: zone, year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(date).map(p => [p.type,p.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
export function validZone(zone) { try { new Intl.DateTimeFormat('en',{timeZone:zone}); return true; } catch { return false; } }
export function endTime(e) { return e.end ? Date.parse(e.end) : Date.parse(e.start) + 90 * 60000; }
export function isExpired(e, now = new Date()) { const age = +now - Date.parse(e.last_verified_at); return !Number.isFinite(age) || age < -300000 || age >= MAX_AGE_DAYS * DAY; }
export function visibleEvent(e, now, zone) { return !isExpired(e,now) && (dayKey(new Date(e.start),zone) >= dayKey(now,zone) || (e.end && Date.parse(e.end) > +now)); }
export function statusLabel(e,now=new Date()) { if(+now < Date.parse(e.start)) return 'Upcoming'; return endTime(e)>+now ? 'Scheduled now' : 'Started earlier'; }
export function filterEvents(events, filters={}, now=new Date(), zone='UTC') {
  const today=dayKey(now,zone), noon=new Date(today+'T12:00:00Z'), weekday=noon.getUTCDay();
  const weekendStart=new Date(+noon + ((5-weekday+7)%7)*DAY);
  if(weekday===0) weekendStart.setUTCDate(noon.getUTCDate()-2);
  if(weekday===6) weekendStart.setUTCDate(noon.getUTCDate()-1);
  const from=dayKey(weekendStart,'UTC'), to=dayKey(new Date(+weekendStart+2*DAY),'UTC');
  return events.filter(e=>{
    if(!visibleEvent(e,now,zone)) return false;
    const key=dayKey(new Date(e.start),zone);
    if(filters.period==='tonight' && key!==today) return false;
    if(filters.period==='week' && (key<today || key>dayKey(new Date(+noon+6*DAY),'UTC'))) return false;
    if(filters.period==='weekend' && (key<from || key>to)) return false;
    for(const field of ['venue','source_type','region','country','type','watch_kind','access']) if(filters[field] && e[field]!==filters[field]) return false;
    if(filters.fresh && e.stale) return false;
    if(filters.search && ![e.title,e.venue,e.program,...(e.artists||[]),...(e.instruments||[])].join(' ').toLowerCase().includes(filters.search.toLowerCase().trim())) return false;
    return true;
  }).sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id));
}
const esc=s=>String(s??'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
export function foldLine(line) {
  let result='',part='',bytes=0;
  for(const char of line) { const n=new TextEncoder().encode(char).length; if(bytes+n>75){result+=part+'\r\n'; part=' '; bytes=1;} part+=char; bytes+=n; }
  return result+part;
}
const stamp=d=>new Date(d).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
export function makeICS(events,now=new Date()) {
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Stringfest Analytics//Jazz Watch//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  for(const e of events) {
    if(isExpired(e,now)) continue;
    const description=[e.venue,e.program,'Free live viewing. '+(e.access_note||''),e.end?'End time supplied by source.':'End time estimated: 90 minutes.','Watch: '+e.stream_url,'Source: '+e.event_url,'Verified: '+e.last_verified_at,e.stale?'STALE: recheck the official page.':'','Calendar download is a snapshot; check for cancellations.'].filter(Boolean).join('\n');
    lines.push('BEGIN:VEVENT','UID:'+e.id+'@jazz-watch.invalid','DTSTAMP:'+stamp(now),'DTSTART:'+stamp(e.start),'DTEND:'+stamp(endTime(e)),'SUMMARY:'+esc(e.title),'DESCRIPTION:'+esc(description),'LOCATION:'+esc(e.venue+' (online)'),'URL:'+esc(e.stream_url),'STATUS:CONFIRMED','END:VEVENT');
  }
  lines.push('END:VCALENDAR'); return lines.map(foldLine).join('\r\n')+'\r\n';
}

