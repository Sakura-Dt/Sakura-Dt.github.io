/* Shared motion runtime: one passive scroll listener, one RAF queue, ordered layout. */
(()=>{
 'use strict';
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*n*(n*(n*6-15)+10)};
 const phase=(p,a,b)=>ease((p-a)/(b-a));
 const score=Object.freeze({intro:{css:'--intro-travel',desktop:1650,tablet:1450,mobile:1120,stops:[0,.245,.52,.8,1]},order:{css:'--order-travel',desktop:1800,tablet:1700,mobile:1550,stops:[0,.25,.5,.72,1]},dimensions:{css:'--dimension-travel',desktop:1400,tablet:1250,mobile:1150,stops:[0,.5,1]},finale:{css:'--finale-travel',desktop:1500,tablet:1300,mobile:1050,stops:[0,.28,.52,.76,1]}});
 const system=matchMedia('(prefers-reduced-motion:reduce)'),controller=new AbortController();
 const scopes=new Map(),scenes=new Map(),jobs=new Map(),scrollJobs=new Set(),layoutJobs=new Set(),resizeJobs=new Set();
 let raf=0,dirty=false,timer=0,suspended=false,destroyed=false,anchorIntent=null,loadAnchor=true,layouts=0,frames=0;
 const mode=()=>({reduced:system.matches||document.body.classList.contains('motion-reduced')||navigator.connection?.saveData===true,steps:innerWidth<=760,short:innerHeight<540});
 function scope(owner){if(!scopes.has(owner))scopes.set(owner,new AbortController());return scopes.get(owner)}
 function on(target,type,fn,options={},owner){const signal=owner?scope(owner).signal:controller.signal;target.addEventListener(type,fn,{...options,signal});return()=>target.removeEventListener(type,fn,options)}
 function remove(root){scenes.delete(root);jobs.delete(root);scopes.get(root)?.abort();scopes.delete(root)}
 function prune(){let changed=false;for(const root of scopes.keys())if(!root.isConnected){remove(root);changed=true}if(changed)invalidate()}
 function request(){if(!raf&&!suspended&&!destroyed)raf=requestAnimationFrame(tick)}
 function frame(key,fn){if(destroyed)return;jobs.set(key,fn);request()}
 function invalidate(){if(destroyed)return;if(!dirty){const target=location.hash?document.getElementById(decodeURIComponent(location.hash.slice(1))):null;const header=document.querySelector('.header')?.offsetHeight||0;anchorIntent=target&&Math.abs(target.getBoundingClientRect().top-header)<24?target.id:null}dirty=true;request()}
 function refresh(){if(destroyed||suspended)return;clearTimeout(timer);timer=setTimeout(()=>{for(const fn of resizeJobs)fn();invalidate()},120)}
 function tick(time){
  raf=0;if(destroyed||suspended)return;prune();
  if(dirty){
   dirty=false;layouts++;
   const ordered=[...scenes.values()].sort((a,b)=>a.root.compareDocumentPosition(b.root)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
   for(const s of ordered)if(!s.root.hidden){const t=score[s.kind];if(t)s.root.style.setProperty(t.css,(innerWidth<=760?t.mobile:innerWidth<1000?t.tablet:t.desktop)+'px');s.measure()}
   for(const s of ordered){const r=s.root.getBoundingClientRect();s.top=r.top+scrollY;s.bottom=s.top+r.height;s.side=null}
   if(anchorIntent){document.getElementById(anchorIntent)?.scrollIntoView({behavior:'instant'});anchorIntent=null}
   for(const fn of layoutJobs)fn();
  }
  const pending=[...jobs.entries()];jobs.clear();frames++;
  for(const [key,fn]of pending)if(!(key instanceof Element)||key.isConnected)fn(time);
  if(jobs.size||dirty)request();
 }
 function scroll(){
  if(suspended||destroyed)return;prune();
  for(const s of scenes.values()){
   if(s.root.hidden)continue;
   const side=scrollY+innerHeight<s.top?-1:scrollY>s.bottom?1:0;
   if(side===0||side!==s.side)s.scroll?.();s.side=side;
  }
  for(const fn of scrollJobs)fn();
 }
 function connect(root,measure,scroll){scope(root);scenes.set(root,{root,measure,scroll,kind:root.matches('.intro')?'intro':root.matches('.order-scene')?'order':root.matches('.dimension-scene')?'dimensions':root.matches('.finale')?'finale':null,side:null,top:0,bottom:0});invalidate();return()=>remove(root)}
 function destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);clearTimeout(timer);controller.abort();for(const c of scopes.values())c.abort();scopes.clear();scenes.clear();jobs.clear();scrollJobs.clear();layoutJobs.clear();resizeJobs.clear();observer?.disconnect();removals.disconnect();raf=0}
 const removals=new MutationObserver(prune);for(const e of [document.body,document.querySelector('main')])if(e)removals.observe(e,{childList:true});
 const observer=parent===window&&'ResizeObserver'in window?new ResizeObserver(refresh):null;
 on(window,'scroll',scroll,{passive:true});on(window,'resize',refresh);on(system,'change',invalidate);
 on(window,'load',()=>{invalidate();if(loadAnchor&&location.hash){anchorIntent=decodeURIComponent(location.hash.slice(1));loadAnchor=false}});
 on(window,'pagehide',e=>{if(e.persisted){suspended=true;cancelAnimationFrame(raf);raf=0;clearTimeout(timer)}else destroy()});
 on(window,'pageshow',e=>{if(e.persisted){suspended=false;for(const fn of resizeJobs)fn();invalidate();scroll()}});
 document.fonts?.ready.then(()=>{if(!destroyed)invalidate()});
 for(const e of document.querySelectorAll('.header,.work-index,.dimension-facts,.order-details,.learning-record'))observer?.observe(e);
 window.SAKURA_MOTION=Object.freeze({score,signal:controller.signal,clamp,ease,phase,frame,invalidate,connect,on,mode,
  follow:(dt,mobile)=>1-Math.exp(-Math.min(50,dt)/(mobile?48:62)),epsilon:.00005,
  watchScroll:fn=>{scrollJobs.add(fn);return()=>scrollJobs.delete(fn)},
  onResize:fn=>{resizeJobs.add(fn);return()=>resizeJobs.delete(fn)},
  onLayout:fn=>{layoutJobs.add(fn);return()=>layoutJobs.delete(fn)},
  destroy,stats:()=>({scenes:scenes.size,queued:jobs.size,raf:!!raf,layouts,frames,suspended,destroyed})});
 // Unpinned handoffs inherit the same clock; their planes change shape, never fade.
 for(const root of document.querySelectorAll('.chapter-seam')){
  const paths=root.querySelectorAll('path');let begin=0,length=1,previous=null;
  const paint=()=>{const p=mode().reduced?.5:clamp((scrollY-begin)/length);if(p===previous)return;previous=p;const t=ease(p);
   if(root.classList.contains('seam-profile')){const hinge=118-82*t;paths[0].setAttribute('d',`M0 0H1440V${24*(1-t)}L518 ${hinge}L0 ${90-56*t}Z`);paths[1].setAttribute('d',`M518 ${hinge}H${518+836*t}`)}
   else{const x=430+550*t,y=158-80*t;paths[1].setAttribute('d',`M0 0H1440L${x} ${y}L0 ${160-24*t}Z`);paths[2].setAttribute('d',`M${x} ${y}H${x+(1354-x)*t}`)}
   root.dataset.progress=p.toFixed(5);
  };
  const requestPaint=()=>frame(root,paint);
  connect(root,()=>{const r=root.getBoundingClientRect();begin=r.top+scrollY-innerHeight;length=innerHeight+r.height;previous=null;requestPaint()},requestPaint);
 }
})();
