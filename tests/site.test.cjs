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
  const bytes=await page.evaluate(()=>performance.getEntriesByType('navigation')[0].decodedBodySize+performance.getEntriesByType('resource').reduce((a,r)=>a+r.decodedBodySize,0));assert.ok(bytes<320*1024,`resource budget: ${bytes}`);console.log(route,bytes,'bytes; axe: 0');
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

test('reduced motion and no JavaScript retain all content, navigation and disclosures',async()=>{
 for(const js of [true,false]){
  const page=await browser.newPage({javaScriptEnabled:js,reducedMotion:'reduce',viewport:{width:390,height:844}});
  try{await page.goto(baseURL);assert.equal(await page.locator('.project:visible').count(),2);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.ok(await page.locator('#top').evaluate(e=>e.offsetHeight-e.querySelector('.intro-stage').offsetHeight<2));await page.locator('.learning-record summary').click();assert.equal(await page.locator('.learning-record').evaluate(e=>e.open),true);if(!js)assert.equal(await page.locator('#navigation').isVisible(),true);await page.goto(baseURL);await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);
  }finally{await page.close()}
 }
});

test('manual reduced mode and mobile intro remain usable; contact deep link stays usable',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{await page.goto(baseURL);await page.locator('.motion-toggle').click();assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('motion-full')),false);await page.locator('.motion-toggle').click();assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('motion-full')),true);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(180);assert.ok(await page.locator('#top').evaluate(e=>e.offsetHeight-e.querySelector('.intro-stage').offsetHeight>500));await page.goto(baseURL+'/#contact');await page.waitForTimeout(250);assert.ok(await page.locator('#contact').evaluate(e=>e.getBoundingClientRect().top>=67&&e.getBoundingClientRect().top<innerHeight/2));
 }finally{await page.close()}
});


test('scroll follow has intermediate frames, settles exactly and stops requesting frames',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{
  await page.addInitScript(()=>{const original=requestAnimationFrame;window.requestedFrames=0;window.requestAnimationFrame=fn=>{window.requestedFrames++;return original(fn)};});
  await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await settle(page);
  const info=await page.locator('#web').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-78,travel:parseFloat(getComputedStyle(e).getPropertyValue('--dimension-travel'))}));
  await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*.2);await settle(page);
  const frame=await page.evaluate(async y=>{scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const el=document.querySelector('#web');return {target:Number(el.dataset.progress),rendered:Number(el.dataset.renderProgress)};},info.start+info.travel*.8);
  assert.ok(frame.rendered>.2&&frame.rendered<frame.target-.01,'scroll step should pass through intermediate frames');
  await settle(page);const rest=await page.locator('#web').evaluate(e=>({target:Number(e.dataset.progress),rendered:Number(e.dataset.renderProgress)}));assert.ok(Math.abs(rest.target-rest.rendered)<.0002);
  const count=await page.evaluate(()=>window.requestedFrames);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.requestedFrames),count,'controller should sleep when settled');
  await page.setViewportSize({width:1280,height:720});await page.waitForTimeout(180);await page.evaluate(()=>scrollTo(0,0));await settle(page);assert.ok(await page.locator('.intro-footer').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1),'loaded fonts must fit the shorter screen');
 }finally{await page.close()}
});


test('anchor landing survives a responsive pin change and profile end keeps readable contrast',async()=>{
 const context=await browser.newContext({viewport:{width:844,height:390}});const page=await context.newPage();
 try{
  await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);
  await page.setViewportSize({width:1440,height:900});await page.goto(baseURL+'/#about');await page.waitForTimeout(300);
  assert.ok(await page.locator('#about').evaluate(e=>Math.abs(e.getBoundingClientRect().top-78)<2),'responsive navigation must stay below the header');
  await page.goto(baseURL);await page.waitForTimeout(1300);const info=await page.locator('#top').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-78,travel:parseFloat(getComputedStyle(e).getPropertyValue('--intro-travel'))}));
  await page.evaluate(y=>scrollTo(0,y),info.start+info.travel);await settle(page);
  const result=await new AxeBuilder({page}).include('#top').withTags(['wcag2a','wcag2aa']).analyze();
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 }finally{await context.close()}
});


test('unified intro pins and reverses actual geometry on desktop, tablet and mobile',async()=>{
 const page=await browser.newPage();
 try{for(const [width,height] of [[1440,900],[1366,768],[390,844],[360,800],[768,1024]]){
  await page.setViewportSize({width,height});await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
  const info=await page.locator('.intro').evaluate(e=>({travel:parseFloat(getComputedStyle(e).getPropertyValue('--intro-travel')),header:document.querySelector('.header').offsetHeight}));
  const states=[];
  for(const p of [0,.245,.52,.8,1,.8,.52,.245,0]){
   await page.evaluate(y=>scrollTo(0,y),info.travel*p);await page.waitForTimeout(650);
   const state=await page.locator('.intro').evaluate(e=>({p:Number(e.dataset.progress),top:e.querySelector('.intro-stage').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth,visual:[...e.querySelectorAll('.identity-face,.identity-creases path,.hero-copy h1>span,.profile-region')].map(el=>[el.getAttribute('d'),el.getAttribute('style')])}));
   assert.ok(Math.abs(state.p-p)<.001);assert.ok(Math.abs(state.top-info.header)<1);assert.equal(state.overflow,false);states.push(state.visual);
   if(p===1){
    const fit=await page.locator('.profile-region').evaluateAll(nodes=>nodes.every(el=>{const r=el.getBoundingClientRect();return r.right<=innerWidth&&r.bottom<=innerHeight-45}));assert.ok(fit,`${width}: profile content fits`);
    if(width<=760){const bandFits=await page.locator('.profile-material').evaluate(e=>e.getBoundingClientRect().bottom<=document.querySelector('.intro-stage').getBoundingClientRect().top+document.querySelector('.intro-stage').clientHeight*.51-4);assert.ok(bandFits,`${width}: material text stays above crease`);}
   }
  }
  for(const [a,b] of [[0,8],[1,7],[2,6],[3,5]])assert.deepEqual(states[a],states[b],`${width}: reverse matches`);
  assert.notDeepEqual(states[0],states[4]);
 }}finally{await page.close()}
});


test('intro follows scroll through intermediate frames and sleeps when settled',async()=>{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 try{await page.addInitScript(()=>{const f=requestAnimationFrame;window.introFrames=0;window.requestAnimationFrame=cb=>{window.introFrames++;return f(cb)}});await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
 const travel=await page.locator('.intro').evaluate(e=>parseFloat(getComputedStyle(e).getPropertyValue('--intro-travel')));
 const intermediate=await page.evaluate(async y=>{scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return Number(document.querySelector('.intro').dataset.renderProgress)},travel*.8);
 assert.ok(intermediate>0&&intermediate<.79);await page.waitForTimeout(750);assert.ok(Math.abs(Number(await page.locator('.intro').getAttribute('data-render-progress'))-.8)<.0001);
 const before=await page.evaluate(()=>window.introFrames);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.introFrames),before);
 await page.goto(baseURL+'/#about');await page.waitForTimeout(750);assert.ok(Number(await page.locator('.intro').getAttribute('data-progress'))>.99);
 await page.locator('.motion-toggle').click();await page.waitForTimeout(100);assert.equal(await page.locator('.profile-composition').evaluate(e=>e.inert),false);assert.ok(await page.locator('.profile-question h3').isVisible());
 }finally{await page.close()}
});


test('Python showcase retains all files and reverses five compositions on desktop and mobile',async()=>{
 const context=await browser.newContext();const page=await context.newPage();
 try{for(const [width,height] of [[1440,900],[390,844]]){
  await page.setViewportSize({width,height});await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
  const fixture=JSON.parse(await fs.readFile(path.join(root,'docs/stage02/fixture-evidence.json'),'utf8'));
  const actual=await page.locator('.order-piece').evaluateAll(nodes=>nodes.map(el=>({name:el.dataset.file,action:el.dataset.action})).sort((a,b)=>a.name.localeCompare(b.name)));
  assert.deepEqual(actual,fixture.plan.map(({name,action})=>({name,action})).sort((a,b)=>a.name.localeCompare(b.name)));
  const info=await page.locator('#python').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight,travel:parseFloat(getComputedStyle(e).getPropertyValue('--order-travel')),header:document.querySelector('.header').offsetHeight}));const states=[];const steps=await page.locator('#python').getAttribute('data-mode')==='steps';if(steps)await page.locator('.order-stage').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight));
  for(const p of [0,.25,.5,.72,1,.72,.5,.25,0]){
   if(steps)await page.locator(`[data-order-step="${[0,.25,.5,.72,1].indexOf(p)}"]`).click();else await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*p);await page.waitForTimeout(800);
   const state=await page.locator('#python').evaluate(e=>({p:Number(e.dataset.progress),top:e.querySelector('.order-stage').getBoundingClientRect().top,styles:[...e.querySelectorAll('[style]')].map(el=>el.getAttribute('style')),overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.ok(Math.abs(state.p-p)<.001);assert.ok(Math.abs(state.top-info.header)<1);assert.equal(state.overflow,false);states.push(state.styles);
   assert.equal(await page.locator('.order-piece:visible').count(),13);
   if(p===1){
    const result=await page.locator('.order-piece').evaluateAll(nodes=>nodes.map(el=>({name:el.dataset.file,opacity:Number(getComputedStyle(el.querySelector('.piece-info')).opacity),...el.getBoundingClientRect().toJSON()})));
    for(const f of result){assert.equal(f.opacity,1);assert.ok(f.left>=0&&f.right<=width+1&&f.bottom<=height-55,`${width}: ${f.name} remains in final composition`);}
    assert.match(await page.locator('.order-result-summary').textContent(),/12.*已移动/);assert.match(await page.locator('.order-log').textContent(),/12 条移动记录/);
    const axe=await new AxeBuilder({page}).include('#python').withTags(['wcag2a','wcag2aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
   }
  }
  for(const [a,b] of [[0,8],[1,7],[2,6],[3,5]])assert.deepEqual(states[a],states[b],`${width}: exact reverse`);
  for(const i of [2,3,4]){await page.locator(`[data-order-step="${i}"]`).click();await page.waitForTimeout(1400);assert.equal(await page.locator(`[data-order-step="${i}"]`).getAttribute('aria-pressed'),'true');}
  await page.locator('[data-order-step="3"]').click();await page.waitForTimeout(1000);await page.locator('[data-order-confirm]').click();await page.waitForTimeout(1200);assert.equal(await page.locator('[data-order-step="4"]').getAttribute('aria-pressed'),'true');
 }}finally{await page.close()}
});


test('Web scene preserves actual source nodes, measured endpoints and reversible layouts',async()=>{
 const context=await browser.newContext();const page=await context.newPage();
 try{for(const [width,height]of[[1440,900],[768,1024],[390,844]]){
  await page.setViewportSize({width,height});await page.goto(baseURL);await page.waitForFunction(()=>document.querySelector('[data-dimension]').dataset.renderReady==='true');
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(700);
  const currentSource=await page.locator('.hero-copy').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});
  const measuredSources=JSON.parse(await fs.readFile(path.join(root,'assets/previews/layouts.json'),'utf8'));
  const sourceReference=measuredSources.find(r=>r.width===width).nodes['.hero-copy'];
  for(const k of ['x','y','w','h'])assert.ok(Math.abs(currentSource[k]-sourceReference[k])<1.1,`live source ${width}: ${k}`);
  const info=await page.locator('#web').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight,travel:parseFloat(getComputedStyle(e).getPropertyValue('--dimension-travel')),header:document.querySelector('.header').offsetHeight}));
  await page.evaluate(()=>window.webHeading=document.querySelector('#web iframe').contentDocument.querySelector('h1'));
  const states=[];const steps=await page.locator('#web').getAttribute('data-mode')==='steps';if(steps)await page.locator('.dimension-stage').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight));
  for(const p of steps?[0,.5,1,.5,0]:[0,.25,.5,.75,1,.75,.5,.25,0]){
   if(steps)await page.locator(`[data-dimension-step="${[0,.5,1].indexOf(p)}"]`).click();else await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*p);await page.waitForTimeout(850);
   const state=await page.locator('#web').evaluate(e=>{const d=e.querySelector('iframe').contentDocument;return{p:Number(e.dataset.progress),top:e.querySelector('.dimension-stage').getBoundingClientRect().top,sourceSame:window.webHeading===d.querySelector('h1'),overflow:document.documentElement.scrollWidth>innerWidth,styles:[...e.querySelectorAll('[style]'),...d.querySelectorAll('[style]')].map(n=>n.getAttribute('style')),paths:[...d.querySelectorAll('.identity-face,.identity-creases path')].map(n=>n.getAttribute('d'))}});
   assert.ok(Math.abs(state.p-p)<.001);assert.ok(Math.abs(state.top-info.header)<1);assert.equal(state.sourceSame,true);assert.equal(state.overflow,false);states.push({styles:state.styles,paths:state.paths});
   if([0,.5,1].includes(p)){
    const reference=JSON.parse(await fs.readFile(path.join(root,'assets/previews/layouts.json'),'utf8'))[[0,.5,1].indexOf(p)];
    const actual=await page.locator('#web').evaluate(e=>{const d=e.querySelector('iframe').contentDocument;return Object.fromEntries(['.brand','.hero-copy','.hero-copy h1','.hero-info','.intro-wordmark','.intro-meta-right'].map(s=>{const r=d.querySelector(s).getBoundingClientRect();return[s,{x:r.x,y:r.y,w:r.width,h:r.height}]}))});
    for(const [s,r]of Object.entries(actual))for(const k of ['x','y','w','h'])assert.ok(Math.abs(r[k]-reference.nodes[s][k])<1.1,`${width} at ${p}, ${s}.${k}: ${r[k]} != ${reference.nodes[s][k]}`);
   }
  }
  for(const [a,b]of steps?[[0,4],[1,3]]:[[0,8],[1,7],[2,6],[3,5]])assert.deepEqual(states[a],states[b],`${width} reverse matches`);
  for(const i of [1,2,0]){await page.locator(`[data-dimension-step="${i}"]`).click();await page.waitForTimeout(1400);assert.equal(await page.locator(`[data-dimension-step="${i}"]`).getAttribute('aria-pressed'),'true');}
 }
 await page.goto(baseURL+'/portfolio.html');await page.waitForFunction(()=>document.querySelector('[data-dimension]').dataset.renderReady==='true');
 assert.equal(await page.locator('h1').count(),1);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 }finally{await context.close()}
});


test('final sequence stays readable, keeps contact clickable and reverses its shared faces',async()=>{
 const context=await browser.newContext();const page=await context.newPage();
 try{for(const [width,height]of[[1440,900],[1366,768],[768,1024],[390,844],[360,800]]){
  await page.setViewportSize({width,height});await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
  const info=await page.locator('.finale').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight,travel:parseFloat(getComputedStyle(e).getPropertyValue('--finale-travel')),header:document.querySelector('.header').offsetHeight}));const states=[];
  for(const p of[0,.28,.52,.76,1,.76,.52,.28,0]){
   await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*p);await page.waitForTimeout(800);
   const state=await page.locator('.finale').evaluate(e=>({p:Number(e.dataset.progress),top:e.querySelector('.finale-stage').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth,paths:[...e.querySelectorAll('.finale-sheet path')].map(n=>n.getAttribute('d')),styles:[...e.querySelectorAll('[style]')].map(n=>n.getAttribute('style'))}));
   assert.ok(Math.abs(state.p-p)<.001);assert.ok(Math.abs(state.top-info.header)<1);assert.equal(state.overflow,false);states.push({paths:state.paths,styles:state.styles});
   if(p===.28){const fit=await page.locator('.next-directions').evaluate(e=>{const r=e.getBoundingClientRect(),f=document.querySelector('.finale-footer').getBoundingClientRect();return r.top>=document.querySelector('.header').offsetHeight&&r.bottom<f.top});assert.ok(fit,`${width}: directions remain above footer`);}
   if(p===1){
    const fit=await page.locator('.contact').evaluate(e=>{const q=s=>e.querySelector(s).getBoundingClientRect(),mail=q('.contact-mail'),github=q('.contact-github'),signature=q('.contact-signature'),heading=q('.contact-heading'),note=q('.contact-note');return {mailEndsBeforeGithub:mail.bottom<=github.top,githubEndsBeforeSignature:github.bottom<=signature.top,headingAboveMail:heading.bottom<=mail.top,noteAboveMail:note.bottom<=mail.top,mailFits:mail.left>=0&&mail.right<=innerWidth,enabled:!e.inert}});
    assert.deepEqual(Object.values(fit),Object.values(fit).map(()=>true),`${width}: contact reading zones`);
    for(const s of['.contact-mail>a','#copy-email','.contact-github'])assert.equal(await page.locator(s).evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))}),true,`${width}: ${s} receives pointer`);
    assert.equal(await page.locator('.contact-github').getAttribute('href'),'https://github.com/Sakura-Dt');
    const axe=await new AxeBuilder({page}).include('.finale').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
   }
  }
  for(const [a,b]of[[0,8],[1,7],[2,6],[3,5]])assert.deepEqual(states[a],states[b],`${width}: ending reverses exactly`);
 }
 }finally{await context.close()}
});


test('final contact deep links, keyboard, disclosure and static fallbacks work',async()=>{
 for(const reducedMotion of['no-preference','reduce'])for(const javaScriptEnabled of[true,false]){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion,javaScriptEnabled});
  try{await page.goto(baseURL+'/#contact');await page.waitForTimeout(850);await page.locator('.contact-mail>a').focus();await page.keyboard.press('Tab');if(javaScriptEnabled)assert.equal(await page.locator('#copy-email').evaluate(e=>e===document.activeElement),true);assert.ok(await page.locator('.contact-mail>a').isVisible());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(javaScriptEnabled&&reducedMotion==='no-preference'){assert.ok(Number(await page.locator('.finale').getAttribute('data-render-progress'))>.99);await page.locator('.finale-footer a[href="#next"]').click();await page.waitForTimeout(850);assert.ok(Number(await page.locator('.finale').getAttribute('data-render-progress'))<.01);await page.locator('.finale').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight+parseFloat(getComputedStyle(e).getPropertyValue('--finale-travel'))*.28));await page.waitForTimeout(800);await page.locator('.learning-record summary').click();assert.equal(await page.locator('.finale').evaluate(e=>e.classList.contains('is-animated')),false);assert.equal(await page.locator('.learning-record').evaluate(e=>e.open),true);await page.locator('.learning-record summary').click();await page.waitForTimeout(800);assert.ok(Math.abs(Number(await page.locator('.finale').getAttribute('data-render-progress'))-.28)<.001);}
  else assert.equal(await page.locator('.finale').evaluate(e=>e.classList.contains('is-animated')),false);
  }finally{await page.close()}
 }
});


test('global copy keeps chapter numbers, Chinese hierarchy and delayed real-page rendering consistent',async()=>{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 try{
  const expected=['01 / 本人','02 / 作品','03 / 学习方向','04 / 联系'];
  for(const route of['/','/portfolio.html','/organizer.html']){
   await page.goto(baseURL+route);await page.evaluate(()=>document.fonts.ready);
   const labels=await page.locator('#navigation>a').allTextContents();assert.deepEqual(labels.map(t=>t.replace('↗','').trim()),expected);
   assert.equal(await page.locator('h1').count(),1);
   if(route==='/'){
    assert.equal((await page.locator('.hero-copy h1').textContent()).replace(/\s/g,''),'把问题，折成形。');
    assert.equal((await page.locator('[data-order-title="0"]').textContent()).replace(/\s/g,''),'文件动身前，去向先落定。');
    assert.ok(await page.locator('.intro-wordmark b').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize)<parseFloat(getComputedStyle(document.querySelector('.hero-copy h1')).fontSize)));
   }else{
    assert.equal(await page.locator('h1').evaluate(e=>e.querySelector('br')===null),true);
    const body=page.locator(route==='/portfolio.html'?'.record-grid p':'.case-grid p').first();assert.ok(await body.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=15));
   }
  }
 }finally{await page.close()}
 const fallback=await browser.newPage({viewport:{width:320,height:800},javaScriptEnabled:false});
 try{for(const route of['/','/portfolio.html','/organizer.html']){await fallback.goto(baseURL+route);assert.equal(await fallback.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' no-script width');assert.equal(await fallback.locator('#navigation>a').count(),4)}}finally{await fallback.close()}
 const delayed=await browser.newPage({viewport:{width:390,height:844}});const errors=[];delayed.on('pageerror',e=>errors.push(e.message));
 try{await delayed.route('**/assets/previews/site-view.html',async route=>{await new Promise(r=>setTimeout(r,350));await route.continue()});await delayed.goto(baseURL+'/portfolio.html');await delayed.waitForFunction(()=>document.querySelector('[data-dimension]').dataset.renderReady==='true');await delayed.waitForTimeout(250);assert.deepEqual(errors,[]);assert.ok(await delayed.locator('iframe').evaluate(e=>!!e.contentDocument.querySelector('.hero-copy h1')))}finally{await delayed.close()}
});


test('integrated score keeps native scroll, settles fast jumps and disposes removed scenes',async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{await page.goto(baseURL);await page.waitForFunction(()=>document.querySelector('#web').dataset.renderReady==='true');await page.waitForTimeout(400);
 const ids=await page.locator('.project').evaluateAll(nodes=>nodes.map(n=>n.id));assert.deepEqual(ids,['python','web']);
 const start=await page.evaluate(()=>SAKURA_MOTION.stats());assert.equal(start.scenes,6);
 for(const y of[99999,0,7000,1500,99999,0]){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(750);assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().queued),0);assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().raf),false)}
 const before=await page.evaluate(()=>SAKURA_MOTION.stats());await page.waitForTimeout(300);const after=await page.evaluate(()=>SAKURA_MOTION.stats());assert.equal(before.frames,after.frames);assert.equal(before.layouts,after.layouts,'scroll must not trigger repeated layout refreshes');
 // Slow scroll and pauses use the same state as an instantaneous landing.
 const info=await page.locator('#python').evaluate(e=>({start:e.offsetTop-document.querySelector('.header').offsetHeight,travel:parseFloat(getComputedStyle(e).getPropertyValue('--order-travel'))}));
 await page.evaluate(async info=>{for(let i=0;i<=20;i++){scrollTo(0,info.start+info.travel*i/40);await new Promise(r=>setTimeout(r,20))}},info);await page.waitForTimeout(750);assert.ok(Math.abs(Number(await page.locator('#python').getAttribute('data-render-progress'))-.5)<.001);
 await page.evaluate(()=>document.querySelector('#web').remove());await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().scenes),5);
 await page.evaluate(()=>SAKURA_MOTION.destroy());assert.deepEqual(await page.evaluate(()=>{const m=SAKURA_MOTION.stats();return[m.scenes,m.queued,m.raf,m.destroyed]}),[0,0,false,true]);
 const frame=await page.evaluate(()=>SAKURA_MOTION.stats().frames);await page.evaluate(()=>{scrollTo(0,0);dispatchEvent(new Event('resize'))});await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().frames),frame);assert.deepEqual(errors,[]);
 }finally{await page.close()}
});


test('mobile uses complete reversible project steps and restores the runtime after page suspension',async()=>{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 try{await page.goto(baseURL);await page.waitForFunction(()=>document.querySelector('#web').dataset.renderReady==='true');await page.waitForTimeout(250);
 for(const [id,attr,points]of[['python','order',[0,.25,.5,.72,1]],['web','dimension',[0,.5,1]]]){
  assert.equal(await page.locator('#'+id).getAttribute('data-mode'),'steps');const y=await page.locator('#'+id).evaluate(e=>e.offsetTop);
  await page.locator(id==='python'?'.order-stage':'.dimension-stage').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight));const landed=await page.evaluate(()=>scrollY);
  for(const i of [...points.keys(),...points.keys()].reverse()){await page.locator(`[data-${attr}-step="${i}"]`).click();await page.waitForTimeout(650);assert.ok(Math.abs(Number(await page.locator('#'+id).getAttribute('data-render-progress'))-points[i])<.001);assert.equal(await page.evaluate(()=>scrollY),landed,'step selection must not move the page')}
 }
 await page.evaluate(()=>{dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));SAKURA_MOTION.frame('resume-proof',()=>window.motionResumed=true)});assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().suspended),true);
 await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().suspended),false);assert.equal(await page.evaluate(()=>window.motionResumed),true);assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().destroyed),false);
 await page.goto(baseURL+'/portfolio.html');await page.waitForFunction(()=>document.querySelector('[data-dimension]').dataset.renderReady==='true');await page.goBack();await page.waitForTimeout(700);assert.equal(await page.locator('#python').getAttribute('data-mode'),'steps');assert.equal(await page.evaluate(()=>SAKURA_MOTION.stats().destroyed),false);
 }finally{await page.close()}
});


test('final art review keeps Python labels clear and mobile steps inside the entry screen',async()=>{
 const page=await browser.newPage();
 try{for(const [width,height]of[[1440,900],[1366,768],[768,1024],[390,844],[360,800]]){
  await page.setViewportSize({width,height});await page.goto(baseURL);await page.waitForFunction(()=>document.querySelector('#web').dataset.renderReady==='true');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
  const info=await page.locator('#python').evaluate(e=>({start:e.offsetTop-document.querySelector('.header').offsetHeight,travel:parseFloat(getComputedStyle(e).getPropertyValue('--order-travel')),steps:e.dataset.mode==='steps'}));
  for(const p of[.25,.5,.72,1]){
   if(info.steps){await page.locator('.order-stage').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight));await page.locator(`[data-order-step="${[0,.25,.5,.72,1].indexOf(p)}"]`).click()}else await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*p);await page.waitForTimeout(750);
   const fit=await page.locator('#python').evaluate((e,p)=>{const rectText=el=>{const range=document.createRange();range.selectNodeContents(el);return range.getBoundingClientRect()};return [...e.querySelectorAll('.order-group')].every((g,i)=>{const plane=g.getBoundingClientRect(),title=rectText(g.querySelector('h3')),count=g.querySelector('.order-group-count').getBoundingClientRect();const file=e.querySelector(`.order-piece[data-group="${i}"]${p===1?'[data-action="move"]':''}`).getBoundingClientRect();return title.right<=plane.right-2&&count.bottom<=file.top-2})},p);assert.equal(fit,true,`${width} at ${p}: group labels and quantities have their own space`);
   if(p===.72){const gap=await page.locator('#python').evaluate(e=>e.querySelector('.order-group').getBoundingClientRect().top-e.querySelector('.order-confirmation').getBoundingClientRect().bottom);assert.ok(gap>=8,`${width}: confirmation margin ${gap}`)}
   if(p===.25&&info.steps){assert.equal(await page.locator('.piece-art>span').evaluateAll(nodes=>nodes.every(e=>{const r=e.getBoundingClientRect(),a=e.parentElement.getBoundingClientRect();return r.top>=a.top-2&&r.bottom<=a.bottom+2})),true)}
  }
  if(info.steps)for(const id of['python','web']){await page.locator('#'+id).evaluate(e=>e.scrollIntoView());await page.waitForTimeout(200);assert.ok(await page.locator('#'+id+' footer nav').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1),`${width}: ${id} controls visible on entry`)}
 }}finally{await page.close()}
});


test('intro controls retain readable contrast through the actual folding surface',async()=>{
 const page=await browser.newPage();
 try{for(const [width,height]of[[1440,900],[390,844],[360,800],[768,1024]]){
  await page.setViewportSize({width,height});await page.goto(baseURL);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);const travel=await page.locator('.intro').evaluate(e=>parseFloat(getComputedStyle(e).getPropertyValue('--intro-travel')));
  for(const p of[.35,.4,.44,.48,.52,.6]){await page.evaluate(y=>scrollTo(0,y),travel*p);await page.waitForTimeout(700);
   const minimum=await page.locator('.intro').evaluate(root=>{const stage=root.querySelector('.intro-stage').getBoundingClientRect(),svg=root.querySelector('.identity-sheet');const lum=color=>{const values=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});return values[0]*.2126+values[1]*.7152+values[2]*.0722};return Math.min(...[...root.querySelector('.intro-footer').children].map(el=>{const r=el.getBoundingClientRect(),point=new DOMPoint(r.x+r.width*.5-stage.x,r.y+r.height*.5-stage.y);const face=[...root.querySelectorAll('.identity-face')].reverse().find(f=>f.isPointInFill(point));const bg=face?getComputedStyle(face).fill:'rgb(241,238,230)',fg=getComputedStyle(el).color;const a=lum(bg),b=lum(fg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}))});assert.ok(minimum>=4.5,`${width} progress ${p}: contrast ${minimum}`);
  }
 }}finally{await page.close()}
});

test('Web dimensions leave clear space around the Chinese scene title',async()=>{
 const page=await browser.newPage();
 try{for(const [width,height]of[[1440,900],[1366,768]])for(const route of['/','/portfolio.html']){
  await page.setViewportSize({width,height});await page.goto(baseURL+route);await page.waitForFunction(()=>document.querySelector('[data-dimension]').dataset.renderReady==='true');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
  const info=await page.locator('[data-dimension]').evaluate(e=>({start:e.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight,travel:parseFloat(getComputedStyle(e).getPropertyValue('--dimension-travel'))}));
  for(const p of[.3,.5,.72]){await page.evaluate(y=>scrollTo(0,y),info.start+info.travel*p);await page.waitForTimeout(650);assert.equal(await page.locator('[data-dimension]').evaluate(e=>{const annotation=e.querySelector('.dimension-measure').getBoundingClientRect();return [...e.querySelectorAll('.dimension-titles>div')].filter(t=>getComputedStyle(t).visibility!=='hidden').every(t=>{const range=document.createRange();range.selectNodeContents(t);const title=range.getBoundingClientRect();return annotation.left>=title.right+8||annotation.top>=title.bottom+8||annotation.bottom<=title.top-8})}),true,`${width} ${route} at ${p}: ruler must not collide with the title`)}
 }}finally{await page.close()}
});
