import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile('data/events.json','utf8'));
const problems=data.sources.filter(s=>!['healthy','manual'].includes(s.status));
if(problems.length){console.error(JSON.stringify(problems,null,2));process.exitCode=1;}else console.log('All configured sources are healthy.');

