import {readFile,writeFile} from 'node:fs/promises';
import {reviewedEvents} from './model.mjs';
const [command,file]=process.argv.slice(2);
const registry=JSON.parse(await readFile('data/registry.json','utf8'));
const manual=JSON.parse(await readFile('data/manual-reviewed.json','utf8'));
if(command==='import'&&file){
  const review=JSON.parse(await readFile(file,'utf8'));
  const updated={schema_version:1,reviews:[...manual.reviews.filter(r=>r.source!==review.source),review]};
  reviewedEvents(registry,updated,new Date());
  await writeFile('data/manual-reviewed.json',JSON.stringify(updated,null,2)+'\n');
  console.log('Review imported with its supplied check timestamp. Run pnpm refresh; do not advance the timestamp without rechecking all source pages.');
}else{
  reviewedEvents(registry,manual,new Date());
  console.log(JSON.stringify(manual,null,2));
  console.log('Import a completed source review with: pnpm review import path/to/review.json');
}

