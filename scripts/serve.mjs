import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
export function createServer({root=resolve('dist'),prefix=''}={}){
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.ics':'text/calendar; charset=utf-8'};
  return http.createServer(async(req,res)=>{
    try{
      let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(prefix){if(!path.startsWith(prefix+'/')){res.writeHead(404);res.end();return;}path=path.slice(prefix.length);}
      if(path.endsWith('/'))path+='index.html';
      const file=resolve(root,'.'+path);
      if(!file.startsWith(root+sep)||!(await stat(file)).isFile())throw Error('Missing');
      res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(await readFile(file));
    }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
  });
}
if(process.argv[1]&&resolve(process.argv[1])===resolve('scripts/serve.mjs'))createServer().listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Jazz Watch: http://127.0.0.1:'+(process.env.PORT||4173)));

