/* Same files, rules and layout rails persist through a reversible native-scroll score. */
(()=>{
'use strict';
const copy=window.SAKURA_COPY,M=window.SAKURA_MOTION;
const root=document.querySelector('.order-scene');if(!root)return;
const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
const stage=$('.order-stage'),files=$$('.order-piece'),groups=$$('.order-group'),titles=$$('[data-order-title]');
const paper=$('.order-paper'),meta=$('.order-meta'),footer=$('.order-footer');
const opening=$('.order-opening-note'),rules=$('.order-rule-note'),plan=$('.order-plan-note'),preview=$('.order-preview-caption'),confirm=$('.order-confirmation'),existing=$('.order-existing'),summary=$('.order-result-summary'),retained=$('.order-root-caption'),log=$('.order-log');
let W,H,mobile,tablet,badgeSize,frames,groupFrames;
const visible=(el,t)=>{el.style.opacity=t;el.style.visibility=t>.001?'visible':'hidden'};
function layout(){
 W=stage.clientWidth;H=stage.clientHeight;mobile=W<=760;tablet=!mobile&&W<1000;
 const badge=$('.piece-art>span');badge.style.fontSize='';badgeSize=parseFloat(getComputedStyle(badge).fontSize);
 const slots=[[],[],[],[],[]];files.forEach((f,i)=>slots[Number(f.dataset.group)].push(i));
 const ax=[.45,.59,.73,.82,.43,.61,.80,.39,.58,.77,.50,.86,.70],ay=[.22,.26,.17,.36,.48,.51,.62,.66,.66,.42,.71,.20,.70],angles=[-13,9,-6,13,6,-11,8,-7,12,-14,10,4,-8];
 const compact=(i,state)=>{
  const g=Number(files[i].dataset.group),list=slots[g],n=list.indexOf(i),skip=files[i].dataset.action==='skip';
  const final=state===4,rank=final&&!skip&&g===0?n-1:n;
  if(mobile){const x=g===4?22:g%2===0?22:W*.54;const top=[.38,.38,.61,.61,.77][g]+(state===3?.065:0);return{x:final&&skip?22:x,y:H*(final&&skip?.875:top+rank*.038),w:W*.40,h:H*.035,r:0};}
  return{x:final&&skip?W*.06:W*(.06+g*.18),y:H*(final&&skip?.825:(state===3?.515:state===4?.44:.40)+rank*.075),w:W*.16,h:H*.062,r:0};
 };
 const chaos=files.map((f,i)=>({x:mobile?W*[.12,.45,.65,.14,.47,.67,.04,.39,.69,.08,.48,.66,.23][i]:W*ax[i]-(i%3)*13,y:H*(mobile?[.31,.30,.39,.47,.46,.54,.56,.62,.64,.38,.64,.27,.64][i]:ay[i]),w:mobile?W*(.22+(i%3)*.015):W*(.09+(i%3)*.013),h:mobile?H*(.12+(i%3)*.018):H*(.17+(i%3)*.025),r:angles[i]}));
 const recognition=files.map((f,i)=>{const g=Number(f.dataset.group),n=slots[g].indexOf(i);if(mobile){const a=compact(i,2);return{...a,y:H*([.39,.39,.615,.615,.77][g]+n*.033),w:W*.35,h:H*.031,r:[-4,3,-2,4][n]};}if(tablet)return{x:W*(.06+g*.18),y:H*(.48+n*.105),w:W*.16,h:H*.10,r:[-4,3,-2,4][n]};return{x:W*(.345+g*.125)+n*5,y:H*(.40+n*.105),w:W*.105,h:H*.13,r:[-4,3,-2,4][n]};});
 frames=[chaos,recognition,files.map((_,i)=>compact(i,2)),files.map((_,i)=>compact(i,3)),files.map((_,i)=>compact(i,4))];
 groupFrames=[0,1,2,3,4].map(s=>groups.map((_,g)=>mobile?{x:g===4?22:g%2===0?22:W*.54,y:H*([.30,.30,.53,.53,.69][g]+(s===3?.065:0)),w:W*.40,h:H*(g<2?(s===1?.22:.19):s===1&&g<4?.16:.145)}:{x:W*(s===1&&!tablet?.34+g*.125:.06+g*.18),y:H*(s===1?(tablet?.32:.24):s===3?.38:s===4?.32:.28),w:W*(s===1&&!tablet?.115:.16),h:H*(s===1?(tablet?.60:.62):s===3?.44:.48)}));
 existing.style.left=mobile?'22px':'6%';existing.style.top=mobile?'49.5%':'66.5%';existing.style.width=mobile?'40%':'16%';
}
function box(el,b){el.style.width=b.w.toFixed(2)+'px';el.style.height=b.h.toFixed(2)+'px';el.style.transform=`translate3d(${b.x.toFixed(2)}px,${b.y.toFixed(2)}px,0) rotate(${b.r||0}deg)`;}
const clamp=t=>Math.max(0,Math.min(1,t)),mix=(a,b,t)=>a+(b-a)*t;
const ease=M.ease;
const phase=(p,a,b)=>ease((p-a)/(b-a));
const blends=(a,b,t)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),w:mix(a.w,b.w,t),h:mix(a.h,b.h,t),r:mix(a.r||0,b.r||0,t)});
const keys=M.score.order.stops,names=copy.order_states;
const show=(el,t,dy=0)=>{visible(el,clamp(t));el.style.transform=`translate3d(0,${dy.toFixed(2)}px,0)`;};
let rendered=0,start=0,travel=1,reduced=false,steps=false,selection=0,queued=false,force=true,last=0,lastPainted=null;
function draw(p){
 const groupProgress=[phase(p,.045,.245),phase(p,.29,.47),phase(p,.585,.70),phase(p,.80,.92)];
 const compact=phase(p,.29,.47),blue=phase(p,.78,.85);
 const leftTop=100*(1-blue),leftBottom=leftTop+Math.sin(blue*Math.PI)*12;
 paper.style.clipPath=`polygon(${leftTop}% 0,100% 0,100% 100%,${leftBottom}% 100%)`;
 const onBlue=(x,y)=>blue>0&&x/W*100>mix(leftTop,leftBottom,y/H);
 files.forEach((el,i)=>{
  let b=frames[0][i];
  [[.045+i*.002,.21+i*.003],[.29+i*.002,.445+i*.002],[.585+i*.001,.675+i*.0018],[.80+i*.002,.89+i*.0025]].forEach(([a,z],j)=>{b=blends(b,frames[j+1][i],phase(p,a,z))});
  const t=phase(p,.045+i*.002,.21+i*.003);b.y-=Math.sin(t*Math.PI)*H*.025*(i%2?1:-1);
  box(el,b);const g=Number(el.dataset.group),light=onBlue(b.x,b.y);
  const art=el.querySelector('.piece-art'),info=el.querySelector('.piece-info');
  const recognized=phase(p,.045,.245);
  art.querySelector('span').style.fontSize=mix(badgeSize,mobile?15:tablet?24:badgeSize,recognized)+'px';
  if(mobile){art.querySelector('span').style.top=mix(9,4,recognized)+'px';art.querySelector('span').style.left='8px'}
  art.querySelectorAll('i').forEach(line=>line.style.opacity=String(W<1000?1-recognized:1));
  if(el.classList.contains('kind-image'))art.style.backgroundImage=`linear-gradient(145deg,transparent 43%,rgba(238,73,45,${W<1000?1-recognized:1}) 43%,rgba(238,73,45,${W<1000?1-recognized:1}) 65%,transparent 65%)`;
  art.style.opacity=1-compact;info.style.bottom='auto';info.style.top=mix(b.h-(mobile?25:36),mobile?2:7,compact)+'px';
  info.style.opacity=mobile?1-phase(p,.10,.23)+phase(p,.30,.47):1;
  el.querySelector('small').style.opacity=compact;el.querySelector('small').style.display=mobile?'none':'block';
  el.querySelector('.piece-status').style.opacity=compact;
  el.style.background=light?'transparent':'';el.style.color=light?'var(--paper)':'';el.style.borderColor=light?'#f1eee680':'';
  el.style.borderWidth=light?'0 0 1px 0':'1px';el.style.zIndex=String(p>.29?2:i%5+1);
 });
 groups.forEach((el,i)=>{
  let b=groupFrames[1][i];for(let j=1;j<4;j++)b=blends(b,groupFrames[j+1][i],groupProgress[j]);box(el,b);
  visible(el,phase(p,.07+i*.015,.24+i*.009));
  const light=onBlue(b.x,b.y);el.style.color=light?'var(--paper)':'var(--ink)';
  el.querySelector('h3').style.fontSize=(mobile?16:Math.min(22,(b.w-16)/5.2,H*.03))+'px';
  const rail=el.querySelector('.order-group-plane');rail.style.borderColor=light?'var(--paper)':'var(--blue)';rail.style.background=light?'transparent':'rgba(39,60,206,.045)';
  rail.style.transform=`scaleY(${mix(.03,1,phase(p,.09,.28))})`;
  const rule=el.querySelector('.order-rule');rule.style.height=(mobile?14:18)*(1-compact)+'px';rule.style.opacity=1-compact;rule.style.overflow='hidden';
  el.querySelector('.order-group-count>span').style.display=p>.86?'none':'inline';el.querySelector('.order-group-count>b').style.display=p>.86?'inline':'none';
 });
 const ins=[[0,.001],[.135,.24],[.35,.47],[.625,.71],[.855,.94]],outs=[[.045,.19],[.29,.405],[.585,.665],[.755,.81],[2,3]];
 titles.forEach((el,i)=>{const a=i===0?1:phase(p,...ins[i]),z=phase(p,...outs[i]);visible(el,a>0&&z<1?1:0);el.style.clipPath=`inset(0 0 ${(1-a+z)*101}% 0)`;el.style.transform=`translate3d(0,${(1-a)*25-z*45}px,0)`;el.style.color=i===4?'var(--paper)':'var(--ink)';});
 show(opening,1-phase(p,.06,.19),-phase(p,.06,.19)*20);
 show(rules,phase(p,.14,.245)*(1-phase(p,.29,.41)));
 show(plan,phase(p,.36,.47)*(1-phase(p,.585,.67)));
 show(preview,phase(p,.40,.49)*(1-phase(p,.585,.66)));
 show(confirm,phase(p,.625,.70)*(1-phase(p,.765,.82)));
 confirm.style.transform=`translate3d(0,${(1-phase(p,.625,.70))*25}px,0) skewY(${mix(-3,0,phase(p,.765,.82))}deg)`;
 confirm.inert=p<.64||p>.82;
 show(existing,phase(p,.88,.95));show(summary,phase(p,.86,.94));show(retained,phase(p,.89,.95));show(log,phase(p,.89,.96));
 [existing,summary,retained,log].forEach(el=>el.style.color='var(--paper)');
 meta.style.color=p>.85?'var(--paper)':'var(--ink)';footer.style.color=p>.85?'var(--paper)':'var(--ink)';
 const active=p<.13?0:p<.375?1:p<.61?2:p<.84?3:4;
 $$('.order-controls button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));
 $('.order-state').textContent=names[active];root.dataset.sceneState=active;
}
function paint(time){
 queued=false;const target=reduced?1:steps?selection:clamp((scrollY-start)/travel);
 const dt=last?Math.min(50,time-last):16.7;last=time;
 rendered=force?target:mix(rendered,target,M.follow(dt,mobile));force=false;
 const settled=Math.abs(rendered-target)<M.epsilon;if(settled)rendered=target;
 if(lastPainted!==rendered){draw(rendered);lastPainted=rendered;}root.dataset.progress=target.toFixed(5);root.dataset.renderProgress=rendered.toFixed(6);root.dataset.settled=String(settled);
 if(!settled)requestPaint();else last=0;
}
function requestPaint(){if(!queued){queued=true;M.frame(root,paint)}}
function measure(){
 if(root.hidden)return;
 reduced=M.mode().reduced||M.mode().short;steps=M.mode().steps&&!reduced;root.dataset.mode=steps?'steps':reduced?'static':'scroll';
 document.body.classList.toggle('order-active',!reduced&&!steps);document.body.classList.toggle('order-static',reduced||steps);
 layout();start=root.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight;
 travel=parseFloat(getComputedStyle(root).getPropertyValue('--order-travel'));
 lastPainted=null;force=true;requestPaint();
}
function go(i){if(reduced)return;if(steps){selection=keys[i];requestPaint();return;}scrollTo({top:start+travel*keys[i],behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});requestPaint()}
$$('[data-order-step]').forEach((b,i)=>M.on(b,'click',()=>go(i),{},root));
M.on($('[data-order-confirm]'),'click',()=>go(4),{},root);
M.connect(root,measure,()=>{if(!steps&&!reduced)requestPaint()});
})();
