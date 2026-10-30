// Behavior and accessibility regression checks for the rebuilt static experience.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'};
let server, browser, baseURL;
before(async()=>{
  server=http.createServer(async(req,res)=>{
    try { const url=new URL(req.url,'http://localhost'); const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname))); if(!file.startsWith(root+path.sep)) {res.writeHead(403).end();return;} const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(body); }
    catch {res.writeHead(404).end();}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));baseURL=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||undefined});
});
after(async()=>{await browser?.close();if(server)await new Promise(r=>server.close(r));});
const settle=async page=>{await page.waitForTimeout(650);await page.waitForFunction(()=>[...document.querySelectorAll('[data-scene]')].every(el=>el.hidden||el.dataset.settled==='true'));};

test('three complete pages load, stay within mobile widths and pass WCAG scans',async()=>{
 const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(baseURL)&&r.status()>=400)errors.push(r.url())});
 try{for(const route of ['/','/portfolio.html','/organizer.html']){
  await page.goto(baseURL+route);assert.equal(await page.locator('h1').count(),1);
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} overflows ${width}`);}
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),[],route);
  const bytes=await page.evaluate(()=>performance.getEntriesByType('navigation')[0].decodedBodySize+performance.getEntriesByType('resource').reduce((a,r)=>a+r.decodedBodySize,0));assert.ok(bytes<256*1024,`resource budget: ${bytes}`);console.log(route,bytes,'bytes; axe: 0');
 }assert.deepEqual(errors,[]);}finally{await page.close()}
});

test('mobile menu preserves layout, closes with Escape and navigates below header',async()=>{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 try{await page.goto(baseURL);const top=await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top);const button=page.locator('.menu-toggle');await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');assert.equal(await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top),top);await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');await button.click();await page.locator('nav a[href="#projects"]').click();assert.equal(await button.getAttribute('aria-expanded'),'false');assert.ok(await page.locator('#projects').evaluate(e=>e.getBoundingClientRect().top>=document.querySelector('.header').getBoundingClientRect().bottom-1));}finally{await page.close()}
});

test('filters preserve real projects, detail routes and learning disclosure work',async()=>{
 const page=await browser.newPage({reducedMotion:'reduce'});
 try{await page.goto(baseURL);for(const category of ['web','python','all']){await page.locator(`[data-filter="${category}"]`).click();assert.equal(await page.locator('.project:visible').count(),category==='all'?2:1);assert.equal(await page.locator('[data-filter][aria-pressed="true"]').count(),1);}await page.locator('.learning-record summary').click();assert.equal(await page.locator('.learning-record').evaluate(e=>e.open),true);await page.locator('a[href="./portfolio.html"]').click();assert.ok(page.url().endsWith('/portfolio.html'));await page.locator('.case-back').click();assert.equal(new URL(page.url()).hash,'#projects');await page.locator('a[href="./organizer.html"]').click();assert.ok(page.url().endsWith('/organizer.html'));assert.equal(await page.locator('a[download]').getAttribute('href'),'./tools/file_organizer.py');}finally{await page.close()}
});

test('email success and denied clipboard both provide usable feedback',async()=>{
 const page=await browser.newPage({reducedMotion:'reduce'});
 try{await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copied=text}},configurable:true}));await page.goto(baseURL);await page.locator('#copy-email').click();assert.equal(await page.evaluate(()=>window.copied),'2538423610@qq.com');assert.match(await page.locator('#copy-status').textContent(),/邮箱已复制/);await page.evaluate(()=>navigator.clipboard.writeText=async()=>{throw new Error('denied')});await page.locator('#copy-email').click();assert.match(await page.locator('#copy-status').textContent(),/请手动复制/);assert.equal(await page.locator('.contact-mail>a').getAttribute('href'),'mailto:2538423610@qq.com');}finally{await page.close()}
});

test('four actual pinned stages have reversible geometry at five scroll positions',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 try{await page.goto(baseURL);await page.waitForTimeout(1200);
 for(const id of ['top','about','web','python']){
  const info=await page.locator('#'+id).evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-78,travel:e.offsetHeight-e.querySelector('.stage').offsetHeight}));assert.ok(info.travel>=500);
  const states=[];
  for(const p of [0,.25,.5,.75,1,.75,.5,.25,0]){
   await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*p);await settle(page);
   const state=await page.locator('#'+id).evaluate(e=>({progress:Number(e.dataset.progress),top:e.querySelector('.stage').getBoundingClientRect().top,visual:[...e.querySelectorAll('[style],.crease-sheet')].map(x=>[x.getAttribute('style'),x.getAttribute('d')])}));
   assert.ok(Math.abs(state.progress-p)<.003,`${id} progress ${state.progress} != ${p}`);assert.ok(Math.abs(state.top-78)<=1,`${id} failed to pin`);states.push(state.visual);
  }
  for(const [a,b] of [[0,8],[1,7],[2,6],[3,5]])assert.deepEqual(states[a],states[b],`${id} reverse mismatch`);
  assert.notDeepEqual(states[0],states[4],`${id} must visually transform`);
 }
 // Opening navigation and copy must fit the actual first screen.
 await page.evaluate(()=>scrollTo(0,0));await settle(page);assert.ok(await page.locator('.opening-bottom').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1));
 // Buttons use the same choreography and can be operated without scrolling.
 for(const [index,label] of [[0,'PREVIEW'],[1,'CONFIRM'],[2,'MOVE & LOG']]){await page.locator(`[data-step="${index}"]`).click();await settle(page);assert.match(await page.locator('.flow-state').textContent(),new RegExp(label));}
 }finally{await page.close()}
});

test('reduced motion and no JavaScript retain all content, navigation and disclosures',async()=>{
 for(const js of [true,false]){
  const page=await browser.newPage({javaScriptEnabled:js,reducedMotion:'reduce',viewport:{width:390,height:844}});
  try{await page.goto(baseURL);assert.equal(await page.locator('.project:visible').count(),2);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.ok(await page.locator('#top').evaluate(e=>e.offsetHeight-e.querySelector('.stage').offsetHeight<2));await page.locator('.learning-record summary').click();assert.equal(await page.locator('.learning-record').evaluate(e=>e.open),true);if(!js)assert.equal(await page.locator('nav').isVisible(),true);await page.goto(baseURL);await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);
  }finally{await page.close()}
 }
});

test('manual motion mode and mobile reflow remove pin travel; contact deep link stays usable',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{await page.goto(baseURL);await page.locator('.motion-toggle').click();assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('motion-full')),false);await page.locator('.motion-toggle').click();assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('motion-full')),true);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(180);assert.ok(await page.locator('#top').evaluate(e=>e.offsetHeight-e.querySelector('.stage').offsetHeight<2));await page.goto(baseURL+'/#contact');await page.waitForTimeout(250);assert.ok(await page.locator('#contact').evaluate(e=>e.getBoundingClientRect().top>=67&&e.getBoundingClientRect().top<innerHeight/2));for(const i of [0,1,2]){await page.locator(`[data-step="${i}"]`).click();await settle(page);assert.equal(await page.locator(`[data-step="${i}"]`).getAttribute('aria-pressed'),'true');}
 }finally{await page.close()}
});


test('scroll follow has intermediate frames, settles exactly and stops requesting frames',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{
  await page.addInitScript(()=>{const original=requestAnimationFrame;window.requestedFrames=0;window.requestAnimationFrame=fn=>{window.requestedFrames++;return original(fn)};});
  await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await settle(page);
  const info=await page.locator('#web').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-78,travel:e.offsetHeight-e.querySelector('.stage').offsetHeight}));
  await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*.2);await settle(page);
  const frame=await page.evaluate(async y=>{scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const el=document.querySelector('#web');return {target:Number(el.dataset.progress),rendered:Number(el.dataset.renderProgress)};},info.start+info.travel*.8);
  assert.ok(frame.rendered>.2&&frame.rendered<frame.target-.01,'scroll step should pass through intermediate frames');
  await settle(page);const rest=await page.locator('#web').evaluate(e=>({target:Number(e.dataset.progress),rendered:Number(e.dataset.renderProgress)}));assert.ok(Math.abs(rest.target-rest.rendered)<.0002);
  const count=await page.evaluate(()=>window.requestedFrames);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.requestedFrames),count,'controller should sleep when settled');
  await page.setViewportSize({width:1280,height:720});await page.waitForTimeout(180);await page.evaluate(()=>scrollTo(0,0));await settle(page);assert.ok(await page.locator('.opening-bottom').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1),'loaded fonts must fit the shorter screen');
 }finally{await page.close()}
});


test('anchor landing survives a responsive pin change and opening end keeps readable contrast',async()=>{
 const context=await browser.newContext({viewport:{width:844,height:390}});const page=await context.newPage();
 try{
  await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);
  await page.setViewportSize({width:1440,height:900});await page.goto(baseURL+'/#about');await page.waitForTimeout(300);
  assert.ok(await page.locator('#about').evaluate(e=>Math.abs(e.getBoundingClientRect().top-78)<2),'responsive navigation must stay below the header');
  await page.goto(baseURL);await page.waitForTimeout(1300);const info=await page.locator('#top').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-78,travel:e.offsetHeight-e.querySelector('.stage').offsetHeight}));
  await page.evaluate(y=>scrollTo(0,y),info.start+info.travel);await settle(page);
  const result=await new AxeBuilder({page}).include('#top').withTags(['wcag2a','wcag2aa']).analyze();
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 }finally{await context.close()}
});
