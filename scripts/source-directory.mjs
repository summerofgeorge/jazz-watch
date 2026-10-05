import {isExpired} from '../src/core.js';
// Research remains in the maintainer registry; only connected sources appear publicly.
export function publicSources(registry,data,now=new Date()){
  return registry.sources.filter(s=>s.status==='active'||(s.adapter==='manual'&&data.events.some(e=>e.source===s.id&&!isExpired(e,now)&&Date.parse(e.end||e.start)>=+now)));
}
