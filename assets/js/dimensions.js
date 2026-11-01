/* One real source document, interpolated between browser-measured layouts. */
(()=>{
'use strict';
const copy=window.SAKURA_COPY,M=window.SAKURA_MOTION;
const roots=[...document.querySelectorAll('[data-dimension]')];if(!roots.length)return;
const clamp=t=>Math.max(0,Math.min(1,t)),mix=(a,b,t)=>a+(b-a)*t;
const ease=M.ease;
const phase=(p,a,b)=>ease((p-a)/(b-a));
const base=new URL('../previews/',document.currentScript.src);
const measurements=fetch(new URL('layouts.json',base),{signal:M.signal}).then(r=>{if(!r.ok)throw Error('Layout measurements unavailable');return r.json()});
for(const root of roots){
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const stage=$('.dimension-stage'),win=$('.dimension-window'),frame=$('iframe'),line=$('.dimension-rules path'),measure=$('.dimension-measure'),notes=$('.dimension-notes'),caption=$('.dimension-caption'),titles=$$('.dimension-titles>div');
 let data,doc,nodes,W,H,poses,start=0,travel=1,reduced=false,steps=false,rendered=0,queued=false,force=true,last=0,lastPainted=null,selection=null;
 const show=(e,t)=>{e.style.opacity=clamp(t);e.style.visibility=t>.001?'visible':'hidden'};
 function layout(){
  W=stage.clientWidth;H=stage.clientHeight;
  if(W>=1000){poses=[{x:W*.06,y:H*.20,h:Math.min(H*.69,W*.70/1.6)},{x:W*.32,y:H*.17,h:H*.73},{x:W*.66,y:H*.14,h:H*.76}];}
  else if(W>760){poses=[{x:W*.08,y:H*.23,h:W*.84/1.6},{x:W*.19,y:H*.20,h:H*.67},{x:W*.49,y:H*.15,h:H*.76}];}
  else{poses=[{x:22,y:H*.25,h:(W-44)/1.6},{x:W*.12,y:H*.22,h:Math.min(H*.59,(W*.76)/.75)},{x:W*.15,y:H*.14,h:Math.min(H*.70,(W*.68)/(.462))}];}
 }
 const interpolate=(a,b,t)=>Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k],b[k],t)]));
 function render(p){
  const i=p<=.5?0:1,t=i===0?phase(p,.04,.46):phase(p,.54,.94),a=data[i],b=data[i+1];
  const width=mix(a.width,b.width,t),height=mix(a.height,b.height,t),header=mix(a.nodes['.header'].h,b.nodes['.header'].h,t);
  const current={};for(const s in a.nodes)current[s]=interpolate(a.nodes[s],b.nodes[s],t);
  const style=(s,v)=>Object.assign(nodes[s].style,v);
  const font=s=>{const r=current[s];style(s,{fontSize:r.fs+'px',lineHeight:r.lh+'px',letterSpacing:r.ls+'px',marginBottom:r.mb+'px',marginTop:r.mt+'px'});};
  function position(s,parentY=0,parentX=0){const r=current[s];style(s,{position:'absolute',left:r.x-parentX+'px',top:r.y-parentY+'px',right:'auto',bottom:'auto',width:r.w+'px',height:r.h+'px',margin:'0'});}
  frame.style.width=width+'px';frame.style.height=height+'px';
  doc.body.style.fontSize=mix(16,i===0?16:15,t)+'px';
  style('.header',{position:'absolute',left:'0',top:'0',width:width+'px',height:header+'px'});
  Object.assign(doc.querySelector('.intro').style,{position:'absolute',top:header+'px',height:height-header+'px',width:'100%'});
  Object.assign(doc.querySelector('.intro-stage').style,{position:'relative',top:'0',height:height-header+'px',minHeight:'0'});
  for(const s of ['.brand','.hero-copy','.hero-info','.intro-meta','.intro-wordmark','.intro-footer'])position(s,s==='.brand'?0:header);
  for(const s of ['.brand','.brand-sub','.hero-copy h1','.hero-greeting','.hero-info','.hero-info p:first-child','.hero-info .intro-work-link','.intro-meta','.intro-wordmark>span:nth-child(1) b','.intro-wordmark>span:nth-child(2) b','.intro-wordmark>span:nth-child(3) b'])font(s);
  style('.hero-info .intro-work-link',{height:current['.hero-info .intro-work-link'].h+'px',minHeight:current['.hero-info .intro-work-link'].h+'px'});
  style('.brand svg',{width:current['.brand svg'].w+'px',height:current['.brand svg'].h+'px'});
  style('.intro-meta-right',{gap:current['.intro-meta-right'].gap+'px'});
  style('.intro-meta b',{display:'block',width:(i===1?mix(a.nodes['.intro-meta b'].w,0,t):current['.intro-meta b'].w)+'px',overflow:'hidden',flexShrink:'0',opacity:i===1?1-t:1});
  const ft=current['.intro-footer'];style('.intro-footer',{display:'block'});
  for(const s of ['.intro-foot-label','.intro-scroll-label','.motion-toggle']){position(s,ft.y,ft.x);font(s);}
  style('.intro-scroll-label',{display:'flex',gap:current['.intro-scroll-label'].gap+'px'});
  doc.querySelector('.intro-scroll-label>span').style.fontSize=mix(i===0?23:23,i===0?23:18,t)+'px';
  doc.documentElement.style.setProperty('--film-foot-size',(i===1?t*10:0)+'px');
  const nav=i===1?interpolate(a.nodes['#navigation'],{...a.nodes['#navigation'],x:width-22-data[2].nodes['.menu-toggle'].w,y:data[2].nodes['.menu-toggle'].y,w:data[2].nodes['.menu-toggle'].w},t):current['#navigation'];
  style('#navigation',{position:'absolute',left:nav.x+'px',top:nav.y+'px',width:nav.w+'px',height:'44px',right:'auto',bottom:'auto',margin:'0',padding:'0',border:'0',display:'flex',flexDirection:'row',gap:current['#navigation'].gap+'px',opacity:i===1?1-phase(t,.25,.95):1,clipPath:`inset(0 ${i===1?t*101:0}% 0 0)`});
  for(const el of nodes['#navigation'].children)Object.assign(el.style,{fontSize:current['#navigation'].fs+'px',minHeight:'44px',justifyContent:'flex-start',flexShrink:'0'});
  const menu=data[2].nodes['.menu-toggle'];style('.menu-toggle',{position:'absolute',left:width-22-menu.w+'px',top:mix(17,menu.y,i===1?t:0)+'px',width:menu.w+'px',height:menu.h+'px',margin:'0',display:'flex',opacity:i===1?phase(t,.40,.96):0});
  const hn=i===1?a.nodes['.header-note']:current['.header-note'];style('.header-note',{position:'absolute',left:i===1?mix(hn.x,width-22,t)+'px':hn.x+'px',top:hn.y+'px',width:hn.w+'px',height:hn.h+'px',display:'block',opacity:i===1?1-phase(t,.05,.8):1});
  const coord=i===1?a.nodes['.fold-coordinate']:current['.fold-coordinate'];style('.fold-coordinate',{position:'absolute',left:coord.x+'px',top:coord.y-header+'px',display:'grid',opacity:i===1?1-t:1});
  doc.querySelector('.fold-coordinate-line').style.width=mix(130,85,i===1?t:0)+'px';
  const tail=doc.querySelector('.fold-coordinate>span:last-child');tail.style.display='block';tail.style.opacity=i===1?1-t:1;
  const svg=doc.querySelector('.identity-sheet');svg.setAttribute('viewBox',`0 0 ${width} ${height-header}`);
  for(const [key,selector]of[['faces','.identity-face'],['creases','.identity-creases path']])doc.querySelectorAll(selector).forEach((el,j)=>{const v=a[key][j].map((n,k)=>mix(n,b[key][j][k],t));el.setAttribute('d',key==='faces'?`M${v[0]} ${v[1]}L${v[2]} ${v[3]}L${v[4]} ${v[5]}Z`:`M${v[0]} ${v[1]}L${v[2]} ${v[3]}`)});
  const core=doc.querySelector('.identity-hinge');core.setAttribute('cx',mix(a.core[0],b.core[0],t));core.setAttribute('cy',mix(a.core[1],b.core[1],t));
  const pose=interpolate(poses[i],poses[i+1],t),scale=pose.h/height,ww=width*scale;
  Object.assign(win.style,{left:pose.x+'px',top:pose.y+'px',width:ww+'px',height:pose.h+'px'});frame.style.transform=`scale(${scale})`;frame.style.visibility='visible';
  line.setAttribute('d',`M${pose.x} ${pose.y-8}v-10m0 5h${ww}m0-5v10M${pose.x+ww+9} ${pose.y}h10m-5 0v${pose.h}m-5 0h10`);
  measure.style.left=(pose.x+(W>=1000?ww:0))+'px';measure.style.transform=W>=1000?'translateX(-100%)':'';measure.style.top=pose.y-51+'px';measure.querySelector('strong').textContent=Math.round(width);measure.querySelector('span').textContent=`× ${Math.round(height)} / CSS PX`;
  if(W>=1000){
   Object.assign(notes.style,{left:'0',top:'0',width:'100%',height:'100%',display:'block'});
   [...notes.children].forEach((el,j)=>{
    const placements=[{x:W*.76,y:H*(.29+j*.145),w:W*.19},{x:W*.06,y:H*(.37+j*.14),w:W*.22},{x:W*(.06+j*.15),y:H*.54,w:W*.14}];
    const r=interpolate(placements[i],placements[i+1],t);Object.assign(el.style,{position:'absolute',left:r.x+'px',top:r.y+'px',width:r.w+'px',margin:'0'});
   });
  }
  if(W<1000){const gutter=W>760?W*.042:22;Object.assign(notes.style,{left:gutter+'px',top:H*(W>760?.70:.60)+'px',width:W-2*gutter+'px',height:'auto',display:'flex'});[...notes.children].forEach(el=>{if(el.style.position)el.removeAttribute('style')});}
  show(notes,W>=1000?1:1-phase(p,.25,.50));
  show(measure,W<=760?1-phase(p,.60,.80):1);show($('.dimension-rules'),W<=760?1-phase(p,.70,.90):1);
  caption.querySelector('span').textContent=W<=760&&p>.75?copy.source_mobile.replace('{width}',Math.round(width)).replace('{height}',Math.round(height)):copy.source;
  const ctext=p<.35?copy.desktop:p<.73?copy.tablet:copy.mobile;caption.querySelector('strong').textContent=ctext;
  caption.style.top=W<=760?(H-108)+'px':W>=1000?'90.5%':p>.5?'91%':'87%';
  titles.forEach((e,j)=>{const ranges=[[0,0,.18,.38],[.25,.43,.65,.82],[.68,.88,2,3]],r=ranges[j],enter=j===0?1:phase(p,r[0],r[1]),leave=phase(p,r[2],r[3]);show(e,enter>0&&leave<1?1:0);e.style.clipPath=`inset(0 0 ${(1-enter+leave)*101}% 0)`;e.style.transform=`translateY(${(1-enter)*20-leave*25}px)`;});
  $$('.dimension-footer button').forEach((e,j)=>e.setAttribute('aria-pressed',String(j===(p<.28?0:p<.75?1:2))));
  root.dataset.viewportWidth=width.toFixed(3);root.dataset.viewportHeight=height.toFixed(3);root.dataset.progress=p.toFixed(6);
 }
 async function init(){
  data=await measurements;
  if(!frame.contentDocument?.querySelector('.hero-copy')||frame.contentDocument.readyState!=='complete')await new Promise(resolve=>{const ready=()=>{if(frame.contentDocument?.querySelector('.hero-copy')&&frame.contentDocument.readyState==='complete'){frame.removeEventListener('load',ready);resolve()}};M.on(frame,'load',ready,{},root);ready()});
  doc=frame.contentDocument;await doc.fonts.ready;await new Promise(r=>setTimeout(r,100));
  if(!root.isConnected||M.stats().destroyed)return;
  doc.querySelector('.motion-toggle').textContent=copy.motion_reduce;
  nodes=Object.fromEntries(Object.keys(data[0].nodes).map(s=>[s,doc.querySelector(s)]));
  const correction=doc.createElement('style');correction.textContent='.intro-foot-label::after{content:attr(data-short-label);font-size:var(--film-foot-size,0px)!important;letter-spacing:0!important}.intro-wordmark,.intro-wordmark>span{overflow:hidden}.intro-meta b{display:block!important}';doc.head.append(correction);
  root.dataset.renderReady='true';M.invalidate();
 }
 function measureLayout(){
  if(root.hidden)return;
  reduced=M.mode().reduced||M.mode().short;steps=M.mode().steps&&!reduced;root.dataset.mode=steps?'steps':reduced?'static':'scroll';
  document.body.classList.toggle('dimension-active',!reduced&&!steps);document.body.classList.toggle('dimension-static',reduced||steps);
  start=root.getBoundingClientRect().top+scrollY-(document.querySelector('.header')?.offsetHeight||0);
  travel=parseFloat(getComputedStyle(root).getPropertyValue('--dimension-travel'));
  if(data&&nodes){layout();lastPainted=null;force=true;requestPaint();}

 }
 function paint(time){
  queued=false;if(!doc?.querySelector('.header'))return;const target=reduced?(selection??(W<=760?1:0)):steps?(selection??0):clamp((scrollY-start)/travel);
  const dt=last?Math.min(50,time-last):16.7;last=time;
  rendered=force?target:mix(rendered,target,M.follow(dt,W<=760));force=false;
  const settled=Math.abs(rendered-target)<M.epsilon;if(settled)rendered=target;
  if(rendered!==lastPainted){render(rendered);lastPainted=rendered;}
  root.dataset.progress=target.toFixed(6);root.dataset.renderProgress=rendered.toFixed(6);root.dataset.settled=String(settled);
  if(!settled)requestPaint();else last=0;
 }
 function requestPaint(){if(data&&nodes&&!queued){queued=true;M.frame(root,paint)}}
 $$('[data-dimension-step]').forEach((b,i)=>M.on(b,'click',()=>{const p=M.score.dimensions.stops[i];if(reduced||steps){selection=p;force=reduced;requestPaint()}else scrollTo({top:start+travel*p,behavior:'smooth'})},{},root));
 M.connect(root,measureLayout,()=>{if(!steps&&!reduced)requestPaint()});
 init().catch(()=>{if(root.isConnected)root.dataset.renderReady='error'});
}
})();
