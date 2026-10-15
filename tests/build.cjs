const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root=path.resolve(__dirname,'..');
execFileSync(process.execPath,[path.join(root,'scripts/build.mjs')],{cwd:root,stdio:'inherit'});
const files=fs.readdirSync(path.join(root,'public'),{recursive:true}).map(x=>x.replaceAll('\\','/'));
for(const required of ['index.html','app.js','redesign.css','background.css','robots.txt','sitemap.xml','assets/logo.png','assets/kasapink-food.png','assets/contours.svg']) assert.ok(files.includes(required),required);
for(const excluded of ['work','tests','docs','.git','Logo Kasapink Food','package.json']) assert.ok(!files.some(x=>x===excluded||x.startsWith(excluded+'/')),excluded);
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 const ref=match[1];
 if(/^(https?:|mailto:|tel:)/.test(ref))continue;
 assert.ok(fs.existsSync(path.join(root,'public',ref)),`Broken built asset: ${ref}`);
}
console.log('PASS build: public references resolve; no work, source packages, docs, or test files published');
