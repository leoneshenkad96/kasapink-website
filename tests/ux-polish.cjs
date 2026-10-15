const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {default:AxeBuilder}=require('@axe-core/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  for(const [width,height] of [[320,740],[360,900],[390,844],[650,740],[768,900],[1440,900]]){
   const context=await browser.newContext({viewport:{width,height}});
   const page=await context.newPage();
   await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href+'#about');
   for(const selector of ['.about-copy p','.service-prose p']){
    const styles=await page.locator(selector).first().evaluate(el=>{const s=getComputedStyle(el);return {align:s.textAlign,last:s.textAlignLast,justify:s.textJustify};});
    assert.equal(styles.align,'justify');
    assert.equal(styles.last,'start');
    assert.equal(styles.justify,'inter-word');
   }
   if(width<=900){
    if(width<=650)assert.ok(await page.locator('nav>a').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=14),'Mobile nav text must be >=14px');
    const safe=await page.evaluate(()=>{
     const content=document.querySelector('#site-content');
     if(!content)return false;
     const r=content.getBoundingClientRect();const w=document.querySelector('#whatsapp-toggle').getBoundingClientRect();
     return r.bottom<=w.top && getComputedStyle(content).overflowY==='auto';
    });
    assert.equal(safe,true,'Mobile reading viewport must end above WhatsApp launcher');
    for(const fraction of [0,.25,.5,1]){
     await page.locator('#site-content').evaluate((e,f)=>e.scrollTop=(e.scrollHeight-e.clientHeight)*f,fraction);
     const hits=await page.evaluate(()=>{
      const content=document.querySelector('#site-content').getBoundingClientRect();
      const button=document.querySelector('#whatsapp-toggle').getBoundingClientRect();
      return [...document.querySelectorAll('#about p')].some(p=>{const range=document.createRange();range.selectNodeContents(p);return [...range.getClientRects()].some(r=>r.top<content.bottom&&r.bottom>content.top&&r.left<button.right&&r.right>button.left&&Math.max(r.top,content.top)<button.bottom&&Math.min(r.bottom,content.bottom)>button.top);});
     });
     assert.equal(hits,false,'Visible paragraph lines must not overlap contact launcher');
    }
    await page.locator('#site-content').evaluate(e=>e.scrollTop=0);
   }
   await page.locator('#service-toggle').click();
   await page.locator('#service-menu a[href="#food"]').click();
   await page.locator('#food').waitFor({state:'visible'});
   assert.equal(await page.locator('#service-toggle').getAttribute('aria-current'),'true');
   assert.match(await page.locator('#service-toggle').evaluate(e=>getComputedStyle(e).textDecorationLine),/underline/);
   assert.ok(await page.locator('#food-title').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)<=76));
   await page.locator('#whatsapp-toggle').click();
   assert.equal(await page.locator('#contact-dialog').evaluate(d=>d.open),true);
   await page.keyboard.press('Escape');
   await page.locator('#service-toggle').click();
   await page.locator('#service-menu a[href="#fragrance"]').click();
   await page.locator('#fragrance').waitFor({state:'visible'});
   assert.equal(await page.locator('#service-toggle').getAttribute('aria-current'),'true');
   assert.match(await page.locator('#fragrance').innerText(),/TBA/);
   assert.ok(await page.locator('#fragrance-title').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)<=76));
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>v.id),[]);
   await page.locator('[data-page="about"]').click();
   await page.locator('#about').waitFor({state:'visible'});
   await page.locator('.skip').focus();
   await page.keyboard.press('Enter');
   await page.waitForFunction(()=>document.activeElement.id==='main',null,{timeout:3000});
   assert.equal(await page.locator('#about').isVisible(),true,'Skip link must preserve the current page');
   assert.equal(await page.locator('#service-toggle').getAttribute('aria-current'),null);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(width<=900)assert.equal(await page.locator('#site-content').evaluate(e=>e.scrollTop),0);
   await page.screenshot({path:path.resolve(__dirname,`../work/polish-about-${width}.png`),fullPage:true});
   console.log(`PASS UX ${width}x${height}: safe reading area, active Service, proportions, navigation, dialog, accessibility`);
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
