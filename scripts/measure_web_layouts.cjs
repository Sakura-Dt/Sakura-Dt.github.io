// Run against a local preview after intentional changes to the real opening layout.
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const url = process.argv[2] || 'http://127.0.0.1:8000';
const selectors = ['.header','.brand','.brand svg','.brand-sub','#navigation','.header-note','.menu-toggle','.intro-meta','.intro-meta-right','.intro-meta b','.hero-copy','.hero-greeting','.hero-copy h1','.hero-info','.hero-info p:first-child','.hero-info .intro-work-link','.intro-wordmark','.intro-wordmark>span:nth-child(1) b','.intro-wordmark>span:nth-child(2) b','.intro-wordmark>span:nth-child(3) b','.fold-coordinate','.intro-footer','.intro-foot-label','.intro-scroll-label','.motion-toggle'];
(async () => {
 const browser = await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined});
 try {
  const page = await browser.newPage();
  const layouts = [];
  for (const [width,height] of [[1440,900],[768,1024],[390,844]]) {
   await page.setViewportSize({width,height});
   await page.goto(url);
   await page.evaluate(() => document.fonts.ready);
   await page.evaluate(() => scrollTo(0,0));
   await page.waitForTimeout(800);
   layouts.push(await page.evaluate(selectors => {
    const round = n => Math.round(n*1000)/1000;
    const nodes = {};
    for (const s of selectors) {
     const e = document.querySelector(s), r = e.getBoundingClientRect(), c = getComputedStyle(e);
     const num = k => round(parseFloat(c[k])||0);
     nodes[s] = {x:round(r.x),y:round(r.y),w:round(r.width),h:round(r.height),fs:num('fontSize'),lh:num('lineHeight'),ls:num('letterSpacing'),mb:num('marginBottom'),mt:num('marginTop'),gap:num('columnGap')};
    }
    const coordinates = s => [...document.querySelectorAll(s)].map(e=>e.getAttribute('d').match(/-?\d*\.?\d+/g).map(Number));
    const core = document.querySelector('.identity-hinge');
    return {width:innerWidth,height:innerHeight,nodes,faces:coordinates('.identity-face'),creases:coordinates('.identity-creases path'),core:[Number(core.getAttribute('cx')),Number(core.getAttribute('cy'))]};
   }, selectors));
   if (width===1440) await page.screenshot({path:path.join(root,'assets/previews/desktop-source.jpg'),type:'jpeg',quality:82});
  }
  await fs.writeFile(path.join(root,'assets/previews/layouts.json'),JSON.stringify(layouts));
  await fs.writeFile(path.join(root,'docs/stage03/source-layouts.json'),JSON.stringify(layouts,null,2));
  console.log('Measured actual page at 1440 / 768 / 390px.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
