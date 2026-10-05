export function zonedTime(local,zone) {
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(local)) throw Error('Full local date/time required');
  const target=Date.parse(local+'Z');
  if(!Number.isFinite(target)||new Date(target).toISOString().slice(0,19)!==local) throw Error('Invalid calendar date');
  const formatter=new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const wall=n=>formatter.format(n).replace(' ','T');
  const offsets=new Set();
  for(let h=-36;h<=36;h+=3) { const t=target+h*3600000; offsets.add(Date.parse(wall(t)+'Z')-t); }
  const matches=[...offsets].map(o=>target-o).filter(t=>wall(t)===local);
  if(matches.length!==1) throw Error('Ambiguous or nonexistent local time');
  return new Date(matches[0]).toISOString();
}
export function clock24(text) {
  const m=text.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if(!m||+m[1]<1||+m[1]>12||+(m[2]||0)>59) throw Error('Invalid clock');
  return String(+m[1]%12+(/pm/i.test(m[3])?12:0)).padStart(2,'0')+':'+(m[2]||'00')+':00';
}
export const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
export function namedDate(text) {
  const m=text.match(/(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (20\d{2})/);
  if(!m) throw Error('Full source date missing');
  return m[3]+'-'+String(months.indexOf(m[1])+1).padStart(2,'0')+'-'+m[2].padStart(2,'0');
}

