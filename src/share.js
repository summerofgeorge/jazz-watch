const defaultBase='https://jazzwatch.stringfestanalytics.com/';
export function shareUrl(base=defaultBase,eventId){
  const url=new URL('./index.html',base);
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw Error('Unsafe sharing URL');
  if(eventId)url.searchParams.set('event',eventId);
  return url.href;
}
export function shareDetails(event,base=defaultBase){
  const when=new Intl.DateTimeFormat('en-US',{timeZone:event.timezone,weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(event.start));
  return {heading:'Share this set',title:event.title+' | Jazz Watch',text:'Join me for a free jazz livestream—found on Jazz Watch.',url:shareUrl(base,event.id),performance:[event.title+(event.set?' · Set '+event.set:''),event.venue,when+' ('+event.timezone+')','Free to watch'+(event.access==='free-registration'?' · Free registration required':''),'Check the official event for schedule changes.'].join('\n')};
}
export const invitationBody=(details,message)=>[message,details.performance,details.url].filter(Boolean).join('\n\n');
export const emailShareUrl=(details,message)=>'mailto:?subject='+encodeURIComponent(details.title.replace(/[\r\n]+/g,' '))+'&body='+encodeURIComponent(invitationBody(details,message).replace(/\r?\n/g,'\r\n'));
export const smsShareUrl=(details,message,apple=false)=>'sms:'+(apple?'&':'?')+'body='+encodeURIComponent(invitationBody(details,message));
export function socialShareUrl(service,details,message){
  const choices={x:['https://twitter.com/intent/tweet','text'],facebook:['https://www.facebook.com/sharer/sharer.php','u'],whatsapp:['https://wa.me/','text']};
  if(!choices[service])throw Error('Unknown sharing service');
  const [base,key]=choices[service],url=new URL(base);
  url.searchParams.set(key,service==='facebook'?details.url:invitationBody(details,message));return url.href;
}
let dialog,details,trigger;
function setupDialog(){
  dialog=document.createElement('dialog');dialog.className='share-dialog';dialog.setAttribute('aria-labelledby','share-heading');
  dialog.innerHTML=`<div class="share-heading"><h2 id="share-heading"></h2><button type="button" class="button secondary" data-close>Close</button></div>
  <p class="share-intro">A little music is better shared. Edit your note, then choose how to send it.</p>
  <label for="share-message">Your message<textarea id="share-message" rows="3"></textarea></label>
  <label for="share-url">Link<input id="share-url" readonly type="url"></label>
  <details class="share-details"><summary>Details included with your message</summary><p data-details></p></details>
  <div class="share-actions"><a class="button" data-email>Email</a><a class="button secondary" data-sms>Text message</a><a class="button secondary" data-whatsapp target="_blank" rel="noopener noreferrer">WhatsApp</a><a class="button secondary" data-x target="_blank" rel="noopener noreferrer">Share on X</a><a class="button secondary" data-facebook target="_blank" rel="noopener noreferrer">Facebook</a><button type="button" class="button secondary" data-copy-post>Copy message &amp; link</button><button type="button" class="button secondary" data-copy-link>Copy link</button><button type="button" class="button secondary" data-native hidden>More options</button></div>
  <p class="share-status" role="status" aria-live="polite"></p><textarea data-copy-fallback aria-label="Text to copy manually" readonly rows="5" hidden></textarea>
  <p class="share-help">Facebook shares the link; copy your message first if you want to include it. Link previews vary by app. Nothing is posted until you choose to send it.</p>`;
  document.body.append(dialog);
  const find=s=>dialog.querySelector(s),status=find('.share-status'),message=find('#share-message');
  find('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus();});
  message.addEventListener('input',()=>{updateLinks();status.textContent='';find('[data-copy-fallback]').hidden=true;});
  async function copy(text,success){
    const current=details,currentMessage=message.value;status.textContent='';find('[data-copy-fallback]').hidden=true;
    const stillCurrent=()=>dialog.open&&current===details&&currentMessage===message.value;
    try{await navigator.clipboard.writeText(text);if(stillCurrent())status.textContent=success;}
    catch{if(!stillCurrent())return;const fallback=find('[data-copy-fallback]');fallback.value=text;fallback.hidden=false;fallback.focus();fallback.select();status.textContent='Copying is unavailable here. Copy the selected text below.';}
  }
  find('[data-copy-link]').addEventListener('click',()=>copy(details.url,'Link copied.'));
  find('[data-copy-post]').addEventListener('click',()=>copy(invitationBody(details,message.value),'Message and link copied.'));
  find('[data-native]').addEventListener('click',async()=>{const current=details;try{await navigator.share({title:details.title,text:[message.value,details.performance].filter(Boolean).join('\n\n'),url:details.url});}catch(e){if(e.name!=='AbortError'&&details===current&&dialog.open)status.textContent='Use a sharing button above, or copy the message and link.';}});
}
function updateLinks(){
  const message=dialog.querySelector('#share-message').value,apple=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  dialog.querySelector('[data-email]').href=emailShareUrl(details,message);dialog.querySelector('[data-sms]').href=smsShareUrl(details,message,apple);
  for(const service of ['facebook','x','whatsapp'])dialog.querySelector('[data-'+service+']').href=socialShareUrl(service,details,message);
}
export function openShare(value,button){
  if(!dialog)setupDialog();details=value;trigger=button;
  dialog.querySelector('#share-heading').textContent=details.heading;dialog.querySelector('#share-message').value=details.text;
  dialog.querySelector('#share-url').value=details.url;dialog.querySelector('[data-details]').textContent=details.performance||'Jazz Watch · A livestream guide by Stringfest Analytics.';
  dialog.querySelector('[data-copy-fallback]').hidden=true;dialog.querySelector('.share-status').textContent='';dialog.querySelector('[data-native]').hidden=typeof navigator.share!=='function';
  dialog.querySelector('.share-details').open=false;updateLinks();dialog.showModal();
}
export function createShareButton(event){
  const button=document.createElement('button');button.type='button';button.className='text-button share-button';button.textContent='Share set';button.setAttribute('aria-label','Share '+event.title+(event.set?' · Set '+event.set:''));button.setAttribute('aria-haspopup','dialog');
  button.addEventListener('click',()=>openShare(shareDetails(event,location.href),button));return button;
}
if(typeof document!=='undefined')for(const button of document.querySelectorAll('[data-share]'))button.addEventListener('click',()=>{
  const kind=button.dataset.share,base=shareUrl(location.href),url=kind==='calendar'?new URL(location.href):new URL(base);
  if(kind==='calendar')url.hash='';
  openShare({heading:kind==='intro'?'Pass along an introduction':kind==='calendar'?'Share this calendar view':'Share Jazz Watch',title:kind==='intro'?'Meet George at Stringfest Analytics':'Jazz Watch · Free jazz livestreams',text:kind==='intro'?document.querySelector('#intro-note').textContent:'Find your next free jazz livestream with Jazz Watch.',performance:kind==='calendar'?'This link keeps the selected filters and time zone. Listings change as sources announce or update their schedules.':kind==='intro'?'Thanks for helping someone discover Stringfest Analytics.':'A calendar of free jazz broadcasts from clubs, concert series, and music schools.',url:url.href},button);
});
