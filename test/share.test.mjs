import test from 'node:test';
import assert from 'node:assert/strict';
import {shareUrl,shareDetails,invitationBody,emailShareUrl,smsShareUrl,socialShareUrl} from '../src/share.js';
const event={id:'fixture-1',title:'A & B Quartet',set:'2',venue:'Fixture Club',timezone:'America/New_York',start:'2026-10-05T00:30:00Z',access:'free-registration'};
test('Shared set links preserve deployment prefix and encode stable IDs, without unrelated filters',()=>{
 const url=new URL(shareUrl('https://example.org/jazz-watch/index.html?search=private#old','a&b'));
 assert.equal(url.pathname,'/jazz-watch/index.html');assert.equal(url.searchParams.get('event'),'a&b');assert.equal(url.searchParams.size,1);assert.equal(url.hash,'');
 assert.throws(()=>shareUrl('ftp://example.org/'));assert.throws(()=>shareUrl('https://name:password@example.org/'));
});
test('Invitations include source date and zone, distinct set, free registration, and schedule caveat',()=>{
 const d=shareDetails(event);assert.match(d.performance,/Set 2/);assert.match(d.performance,/October 4, 2026/);assert.match(d.performance,/8:30 PM/);assert.match(d.performance,/America\/New_York/);assert.match(d.performance,/Free registration required/);assert.match(d.performance,/schedule changes/);
 assert.equal(invitationBody(d,'See you there!'),'See you there!\n\n'+d.performance+'\n\n'+d.url);
});
test('Sharing URLs safely encode notes and do not turn subjects into injected mail headers',()=>{
 const d={...shareDetails(event),title:'Jazz\r\nBcc: unwanted@example.org'},message='Hi & hello? #music + <jazz>';
 const email=new URL(emailShareUrl(d,message));assert.doesNotMatch(email.searchParams.get('subject'),/[\r\n]/);assert.match(email.searchParams.get('body'),/Hi & hello\? #music \+ <jazz>/);
 assert.match(smsShareUrl(d,message,true),/^sms:&body=/);assert.match(smsShareUrl(d,message),/^sms:\?body=/);
 assert.equal(new URL(socialShareUrl('facebook',d,message)).searchParams.get('u'),d.url);
 assert.equal(new URL(socialShareUrl('x',d,message)).searchParams.get('text'),invitationBody(d,message));assert.throws(()=>socialShareUrl('unknown',d,message));
});
