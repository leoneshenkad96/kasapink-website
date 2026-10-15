const {chromium}=require('playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 const out=path.resolve(__dirname,'../work/background-study');
 fs.mkdirSync(out,{recursive:true});
 const options=[
  {name:'linen',label:'Warm Linen',canvas:'#f4f0e8',sage:'#e9e4d8',warm:'#eadbd0'},
  {name:'sage',label:'Sage Atelier — chosen',canvas:'#eef2ed',sage:'#dce7de',warm:'#f3eae4'},
  {name:'rose',label:'Rose Stone',canvas:'#f5eeec',sage:'#eadbdc',warm:'#eee0d5'}
 ];
 try {
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  for(const option of options){
   await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
   await page.evaluate(o=>{for(const [k,v] of Object.entries({'--canvas':o.canvas,'--wash-sage':o.sage,'--wash-warm':o.warm}))document.documentElement.style.setProperty(k,v);},option);
   await page.screenshot({path:path.join(out,option.name+'.png'),fullPage:true});
   console.log('Rendered',option.label);
  }
  await context.close();
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
