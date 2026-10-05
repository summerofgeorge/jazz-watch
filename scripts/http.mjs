import {safeUrl} from '../src/core.js';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export class StopRequest extends Error {}
export function parseRobots(text,agent='jazzwatch') {
  const groups=[];let group=null,hasRules=false;
  for(const line of text.split(/\r?\n/)) {
    const m=line.split('#')[0].trim().match(/^([\w-]+)\s*:\s*(.*)$/); if(!m) continue;
    const key=m[1].toLowerCase(), value=m[2].trim();
    if(key==='user-agent'){if(!group||hasRules){group={agents:[],rules:[],delay:0};groups.push(group);hasRules=false;}group.agents.push(value.toLowerCase());}
    else if(group){hasRules=true;if(['allow','disallow'].includes(key)&&value)group.rules.push({allow:key==='allow',path:value});if(key==='crawl-delay'&&Number.isFinite(+value))group.delay=Math.max(group.delay,+value*1000);}
  }
  const specific=groups.filter(g=>g.agents.some(a=>a!=='*'&&agent.includes(a)));
  const selected=specific.length?specific:groups.filter(g=>g.agents.includes('*'));
  return {rules:selected.flatMap(g=>g.rules),delay:Math.max(0,...selected.map(g=>g.delay))};
}
export function robotsAllows(policy,url) {
  const path=new URL(url).pathname+new URL(url).search;
  const matches=policy.rules.filter(r=>{
    const end=r.path.endsWith('$');
    const value=(end?r.path.slice(0,-1):r.path).split('*').map(s=>[...s].map(c=>'.+?^$()[]{}|\\'.includes(c)?'\\'+c:c).join('')).join('.*');
    return new RegExp('^'+value+(end?'$':'')).test(path);
  }).sort((a,b)=>b.path.length-a.path.length||Number(b.allow)-Number(a.allow));
  return !matches.length||matches[0].allow;
}
export function createFetcher({allowedHosts,fetchImpl=fetch,pause=sleep,clock=Date.now,requestLimit=60,maxBytes=2_000_000,totalBytes=15_000_000,timeout=15000,maxDuration=480000,minInterval=1000,hostIntervals={}}={}) {
  const hosts=new Set(allowedHosts),last=new Map(),policies=new Map(),cache=new Map();
  const started=clock();let requests=0,bytes=0,tail=Promise.resolve();
  const stats=()=>({requests,request_limit:requestLimit,response_bytes:bytes,duration_ms:clock()-started});
  function check(url) { const u=new URL(url);if(!safeUrl(url)||!hosts.has(u.hostname)||/youtube\.com$|youtu\.be$/.test(u.hostname))throw new StopRequest('URL is outside the explicit collection allowlist'); }
  async function raw(url,isRobots=false) {
    check(url);let current=url;
    for(let hop=0;hop<4;hop++){
      check(current);const host=new URL(current).hostname;
      if(!isRobots) {const policy=await robots(current);if(!robotsAllows(policy,current))throw new StopRequest('robots.txt disallows this path');}
      const interval=Math.max(minInterval,hostIntervals[host]||0,policies.get(new URL(current).origin)?.delay||0);
      if(interval>30000)throw new StopRequest('Crawl delay exceeds this collector run budget');
      let response;
      for(let attempt=0;attempt<2;attempt++){
        const wait=interval-(clock()-(last.get(host)??-Infinity));if(wait>0)await pause(wait);
        if(requests>=requestLimit||clock()-started>=maxDuration)throw new StopRequest('Collection budget exhausted');
        requests++;last.set(host,clock());
        try {
          response=await fetchImpl(current,{redirect:'manual',signal:AbortSignal.timeout(timeout),headers:{'User-Agent':'JazzWatch/1.0 (free jazz calendar; daily bounded research)','Accept':'text/html, text/plain;q=0.9, application/json;q=0.8'}});
        } catch(error){if(attempt)throw new Error('Network request failed: '+(error.cause?.code||error.name),{cause:error});await pause(1000);continue;}
        if([502,503,504].includes(response.status)&&attempt===0){await response.body?.cancel();await pause(1000);continue;}break;
      }
      if(response.status>=300&&response.status<400){
        const location=response.headers.get('location');await response.body?.cancel();
        if(!location)throw new StopRequest('Redirect without destination');
        current=new URL(location,current).href;
        if(isRobots&&new URL(current).origin!==new URL(url).origin)throw new StopRequest('Cross-origin robots redirect');
        continue;
      }
      if(isRobots&&response.status===404){await response.body?.cancel();return '';}
      if(!response.ok){await response.body?.cancel();throw new StopRequest('HTTP '+response.status+' from '+host);}
      const contentType=response.headers.get('content-type')||'';
      if(!/text\/|application\/(json|xml|xhtml\+xml)/i.test(contentType)){await response.body?.cancel();throw new StopRequest('Unexpected response content type');}
      if(Number(response.headers.get('content-length'))>maxBytes){await response.body?.cancel();throw new StopRequest('Response too large');}
      let size=0;const chunks=[];
      if(response.body){const reader=response.body.getReader();try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;bytes+=value.byteLength;if(size>maxBytes||bytes>totalBytes){await reader.cancel();throw new StopRequest('Response byte budget exceeded');}chunks.push(value);}}finally{reader.releaseLock();}}
      return Buffer.concat(chunks).toString('utf8');
    }
    throw new StopRequest('Redirect limit exceeded');
  }
  async function robots(url) {
    const origin=new URL(url).origin;if(policies.has(origin))return policies.get(origin);
    const policy=parseRobots(await raw(origin+'/robots.txt',true));policies.set(origin,policy);return policy;
  }
  function get(url){check(url);if(cache.has(url))return cache.get(url);const result=tail.then(()=>raw(url));tail=result.catch(()=>{});cache.set(url,result);return result;}
  get.stats=stats;return get;
}
