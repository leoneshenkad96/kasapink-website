import {cp, mkdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'public');
const files=['index.html','app.js','redesign.css','background.css','robots.txt','sitemap.xml',
  'assets/logo.png','assets/kasapink-food.png','assets/contours.svg','assets/favicon.png','assets/apple-touch-icon.png'];
await rm(output,{recursive:true,force:true});
for(const file of files){
  const destination=path.join(output,file);
  await mkdir(path.dirname(destination),{recursive:true});
  await cp(path.join(root,file),destination);
}
console.log(`Built ${files.length} public files; source packages and workspace artifacts excluded.`);
