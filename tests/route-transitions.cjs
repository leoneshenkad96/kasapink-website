const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
const base = process.env.SITE_URL || pathToFileURL(path.resolve(__dirname, '../index.html')).href;

async function observeNavigation(page, action) {
  await page.evaluate(() => {
    window.__navigationResult = new Promise(resolve => addEventListener('hashchange', () => {
      const section = document.querySelector('.page:not([hidden])');
      const animations = section.getAnimations();
      resolve({
        route: section.id,
        visibleCount: document.querySelectorAll('.page:not([hidden])').length,
        focused: document.activeElement.id,
        title: document.title,
        scroll: [scrollY, document.querySelector('#site-content').scrollTop],
        animations: animations.map(a => ({duration: a.effect.getTiming().duration, frames: a.effect.getKeyframes()})),
        chromeAnimations: document.querySelector('.header').getAnimations({subtree:true}).length
      });
    }, {once:true}));
  });
  await action();
  return page.evaluate(() => window.__navigationResult);
}

(async () => {
  const browser = await chromium.launch({channel:'msedge', ignoreDefaultArgs:['--hide-scrollbars']});
  try {
    for (const width of [390, 768, 1440]) {
      const page = await browser.newPage({viewport:{width,height:900}, reducedMotion:'no-preference'});
      const errors=[];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base);
      assert.equal(await page.locator('.page').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).length), 0, 'Initial load must not animate');
      const brand = await page.locator('.brand').boundingBox();
      const about = await observeNavigation(page, async () => {
        await page.locator('[data-page="about"]').focus();
        await page.keyboard.press('Enter');
      });
      assert.equal(about.route,'about');
      assert.equal(about.visibleCount,1);
      assert.equal(about.focused,'about-title');
      assert.equal(about.title,'About Us — Kasapink');
      assert.deepEqual(about.scroll,[0,0]);
      assert.equal(about.chromeAnimations,0,'Header must not animate');
      assert.equal(about.animations.length,1,'Routing must animate the incoming content');
      const animation=about.animations[0];
      assert.ok(animation.duration>=180 && animation.duration<=280,'Motion must finish quickly');
      assert.equal(animation.frames[0].opacity,'0');
      assert.equal(animation.frames.at(-1).opacity,'1');
      assert.match(animation.frames[0].transform,/translateY\([1-8]px\)/,'Movement must remain subtle');
      assert.equal(animation.frames.at(-1).transform,'translateY(0px)');
      for (const route of ['food','fragrance','home']) {
        const result=await observeNavigation(page,async()=>{
          if(route==='home') await page.locator('[data-page="home"]').click();
          else {await page.locator('#service-toggle').click();await page.locator(`#service-menu a[href="#${route}"]`).click();}
        });
        assert.equal(result.route,route);
        assert.equal(result.animations.length,1);
        assert.equal(result.visibleCount,1);
      }
      const back=await observeNavigation(page,()=>page.goBack());
      assert.equal(back.route,'fragrance');
      assert.equal(back.animations.length,1,'Browser Back must animate');
      const forward=await observeNavigation(page,()=>page.goForward());
      assert.equal(forward.route,'home');
      assert.equal(forward.animations.length,1,'Browser Forward must animate');
      await page.evaluate(async()=>{
        for(const route of ['about','food','fragrance','home','about']) {
          await new Promise(resolve=>{addEventListener('hashchange',resolve,{once:true});location.hash=route;});
        }
      });
      await page.waitForFunction(()=>document.querySelectorAll('.page:not([hidden])').length===1 && document.querySelector('#about').getAnimations().length===0);
      assert.equal(await page.locator('.page').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).length),0,'Rapid navigation must leave no stale animations');
      assert.equal(await page.locator('#about').evaluate(e=>getComputedStyle(e).opacity),'1');
      assert.equal(await page.locator('#about').evaluate(e=>getComputedStyle(e).transform),'none');
      const finalBrand=await page.locator('.brand').boundingBox();
      assert.ok(Math.abs(brand.x-finalBrand.x)<0.5 && Math.abs(brand.y-finalBrand.y)<0.5,'Logo must remain stationary');
      await page.emulateMedia({reducedMotion:'reduce'});
      const reduced=await observeNavigation(page,()=>page.locator('[data-page="home"]').click());
      assert.equal(reduced.animations.length,0,'Reduced motion must skip route animation');
      // If the setting changes mid-transition, stop motion immediately.
      await page.emulateMedia({reducedMotion:'no-preference'});
      await observeNavigation(page,()=>page.locator('[data-page="about"]').click());
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches && [...document.querySelectorAll('.page')].every(e=>e.getAnimations().length===0),null,{timeout:1000});
      assert.equal(await page.locator('.page').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).length),0);
      const fallback=await observeNavigation(page,()=>page.evaluate(()=>location.hash='invalid-route'));
      assert.equal(fallback.route,'home');
      assert.equal(fallback.visibleCount,1);
      assert.deepEqual(errors,[]);
      console.log(`PASS motion ${width}px: restrained entrance, keyboard/history, rapid routing, fixed header, reduced motion`);
      await page.close();
    }
    const direct=await browser.newPage();
    await direct.goto(base+'#about');
    assert.equal(await direct.locator('#about').isVisible(),true);
    assert.equal(await direct.locator('#about').evaluate(e=>e.getAnimations().length),0,'Deep links must render without a transition');
    await direct.close();
    const legacy=await browser.newPage({reducedMotion:'no-preference'});
    await legacy.addInitScript(()=>{Element.prototype.animate=undefined;});
    await legacy.goto(base);
    const fallback=await observeNavigation(legacy,()=>legacy.locator('[data-page="about"]').click());
    assert.equal(fallback.route,'about');
    assert.equal(fallback.focused,'about-title');
    assert.equal(fallback.animations.length,0,'Routing must work without the animation API');
    await legacy.close();
    console.log('PASS motion: direct links and browsers without animation support render immediately');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
