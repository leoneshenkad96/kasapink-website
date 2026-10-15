const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
require('node:fs').mkdirSync(path.resolve(__dirname,'../work'),{recursive:true});
const {chromium} = require('playwright');
const {default: AxeBuilder} = require('@axe-core/playwright');
(async () => {
 const browser = await chromium.launch({channel:'msedge'});
 try {
  for (const width of [360, 768, 1440]) {
   const context = await browser.newContext({viewport:{width,height:900}});
   const page = await context.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
   assert.match(await page.locator('#home h1').innerText(),/Rasa\.\s*Aroma\.\s*Cerita kita\./);
   assert.equal(await page.locator('.stage-top').count(),0);
   assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(238, 242, 237)');
   assert.notEqual(await page.evaluate(()=>getComputedStyle(document.body).backgroundImage),'none');
   assert.equal(await page.evaluate(()=>getComputedStyle(document.body,'::before').pointerEvents),'none');
   assert.notEqual(await page.locator('.brand-art').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
   assert.equal(await page.locator('.brand-stage').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
   await page.locator('[data-page="about"]').click();
   await page.locator('#about').waitFor({state:'visible'});
   assert.equal(await page.locator('#about').isVisible(),true);
   assert.deepEqual(await page.locator('#about .about-copy h2').allTextContents(),['Satu identitas, beragam pengalaman.','Pendekatan Kami']);
   assert.deepEqual(await page.locator('#about .about-copy p').allTextContents(),[
    'Kasapink adalah brand yang dikembangkan untuk menghadirkan pengalaman melalui makanan dan wewangian. Kami melihat keduanya sebagai bagian dari keseharian yang memiliki kedekatan dengan setiap orang: makanan melalui rasa yang dinikmati, dan wewangian melalui aroma yang membawa kesan.',
    'Di bawah satu identitas, Kasapink memberi ruang bagi setiap lini bisnis untuk tumbuh dengan karakter dan fokusnya masing-masing. Kasapink Food berfokus pada makanan, sementara Kasapink Fragrance sedang dipersiapkan sebagai langkah berikutnya. Keduanya membawa pendekatan yang sama: memperhatikan detail, membangun proses yang terarah, dan menyampaikan informasi produk dengan jelas.',
    'Bagi Kasapink, pengalaman pelanggan dimulai sebelum sebuah produk digunakan atau dinikmati. Pengalaman tersebut terbentuk sejak seseorang mengenal brand, mencari informasi, mengajukan pertanyaan, hingga menentukan pilihannya.',
    'Karena itu, kami mengutamakan kejelasan dalam memperkenalkan produk dan kemudahan dalam berkomunikasi. Kami ingin pelanggan dapat memahami apa yang ditawarkan Kasapink, mengetahui perkembangan setiap lini, dan menghubungi kami melalui saluran yang mudah dijangkau.',
    'Kami juga percaya bahwa konsistensi membutuhkan proses yang dapat dijalankan dan dievaluasi. Perhatian pada pencatatan, persiapan, dan pelaksanaan menjadi bagian dari cara kami membangun usaha secara bertahap.'
   ]);
   const copyWidth=await page.locator('.about-copy').evaluate(el=>el.getBoundingClientRect().width);
   assert.ok(copyWidth >= (width>=768 ? 680 : width-44), `Reading column too narrow: ${copyWidth}`);
   const aboutAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(aboutAxe.violations.map(v=>v.id),[]);
   assert.equal(await page.locator('#about .draft-note').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:path.resolve(__dirname,`../work/about-${width}.png`),fullPage:true});
   await page.locator('#service-toggle').click();
   assert.equal(await page.locator('#service-toggle').getAttribute('aria-expanded'),'true');
   await page.locator('#service-menu a[href="#fragrance"]').click();
   await page.locator('#fragrance').waitFor({state:'visible'});
   assert.equal(await page.locator('#fragrance').isVisible(),true);
   assert.match(await page.locator('#fragrance').innerText(),/TBA/);
   assert.equal(await page.locator('#fragrance .service-prose p').innerText(),'Lini ini akan memiliki karakter tersendiri dalam keluarga Kasapink. Informasi mengenai konsep, pilihan produk, serta waktu peluncuran akan kami sampaikan setelah siap diperkenalkan.');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal((await page.locator('#fragrance .eyebrow').innerText()).replace(/\s+/g,' ').trim(),'KASAPINK / FRAGRANCE TBA');
   assert.doesNotMatch(await page.locator('#fragrance').innerText(),/OUR SERVICE \/ 02/);
   await page.screenshot({path:path.resolve(__dirname,`../work/fragrance-${width}.png`),fullPage:true});
   await page.locator('#service-toggle').click();
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#service-menu').isVisible(),false);
   await page.locator('#service-toggle').click();
   await page.locator('#service-menu a[href="#food"]').click();
   await page.locator('#food').waitFor({state:'visible'});
   assert.equal(await page.locator('#food').isVisible(),true);
   assert.equal(await page.locator('#food .service-prose p').innerText(),'Kasapink Food merupakan lini makanan Kasapink yang mengutamakan resep terukur dan rasa yang konsisten. Setiap menu memiliki resep standar dengan takaran yang jelas sebagai acuan dalam proses persiapannya.');
   const foodLogo=page.locator('#food .food-logo');
   assert.equal(await foodLogo.count(),1);
   assert.equal(await foodLogo.evaluate(el=>el.complete && el.naturalWidth===2048),true);
   const logoBox=await foodLogo.boundingBox();
   const titleBox=await page.locator('#food-title').boundingBox();
   assert.ok(logoBox.y+logoBox.height<=titleBox.y || logoBox.x>=titleBox.x+titleBox.width);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const foodAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(foodAxe.violations.map(v=>v.id),[]);
   await page.screenshot({path:path.resolve(__dirname,`../work/food-${width}.png`),fullPage:true});
   await page.locator('#whatsapp-toggle').click();
   await page.evaluate(()=>{window.open=url=>{window.__sent=url;};});
   await page.locator('.send').click();
   assert.equal(await page.evaluate(()=>window.__sent),undefined);
   await page.locator('#contact-name').fill('Henka & Tim');
   await page.locator('#contact-phone').fill('081234567890');
   await page.locator('#contact-message').fill('Halo, Food & Fragrance?\nMau bertanya.');
   await page.locator('.send').click();
   const url = new URL(await page.evaluate(()=>window.__sent));
   assert.equal(url.origin+url.pathname,'https://wa.me/6287884363963');
   assert.equal(url.searchParams.get('text'),'Halo Kasapink,\n\nNama: Henka & Tim\nNomor Telepon: 081234567890\nPesan: Halo, Food & Fragrance?\nMau bertanya.');
   const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>v.id),[]);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#contact-dialog').evaluate(d=>d.open),false);
   await page.locator('[data-page="home"]').click();
   await page.locator('#home').waitFor({state:'visible'});
   assert.equal(await page.locator('#home').isVisible(),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const homeAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(homeAxe.violations.map(v=>v.id),[]);
   assert.deepEqual(errors,[]);
   await page.screenshot({path:path.resolve(__dirname,`../work/redesign-${width}.png`),fullPage:true});
   await page.emulateMedia({forcedColors:'active'});
   assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundImage),'none');
   assert.equal(await page.evaluate(()=>getComputedStyle(document.body,'::before').display),'none');
   await page.emulateMedia({forcedColors:'none',media:'print'});
   assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundImage),'none');
   await page.emulateMedia({media:'screen'});
   console.log(`PASS ${width}px: navigation, WhatsApp validation + URL, accessibility, background safeguards, no overflow or JS errors`);
   await page.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
