/* Six shared faces, five designed poses. Native scroll drives the sequence. */
(() => {
 'use strict';
 const M=window.SAKURA_MOTION;
 const root=document.querySelector('.finale');if(!root)return;
 const stage=root.querySelector('.finale-stage'),next=root.querySelector('.next'),heading=root.querySelector('.next-heading'),h2=heading.querySelector('h2'),body=heading.querySelector('p'),directions=root.querySelector('.next-directions'),rows=[...root.querySelectorAll('.direction')],label=root.querySelector('.next-figure-label'),bridge=root.querySelector('.finale-bridge'),contact=root.querySelector('.contact'),anchor=root.querySelector('.finale-anchor'),record=root.querySelector('.learning-record');
 const svg=root.querySelector('.finale-sheet'),faces=[...root.querySelectorAll('.finale-faces path')],seams=[...root.querySelectorAll('.finale-seams path')],point=root.querySelector('.finale-point');
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=M.ease,range=(p,a,b)=>ease((p-a)/(b-a)),mix=(a,b,t)=>a+(b-a)*t;
 let w=1440,h=822,phone=false,tablet=false,enabled=false,travel=1720,start=0,current=0,target=0,raf=0,last=0,lastPaint=-1,titleSize=42,compactTitleSize=28;
 const keys=M.score.finale.stops;
 function pose(i){
  if(phone){
   return [
    {hub:[.5,.64],rim:[[.11,.60],[.48,.46],[.87,.58],[.83,.72],[.49,.79],[.16,.72]]},
    {hub:[.48,.27],rim:[[.01,.26],[.33,.245],[.76,.245],[.99,.27],[.62,.28],[.16,.28]]},
    {hub:[.47,.66],rim:[[-.04,.61],[.33,.50],[.98,.63],[1.04,.84],[.52,.78],[.04,.91]]},
    {hub:[.78,.19],rim:[[.61,.16],[.79,.09],[.96,.15],[.94,.25],[.78,.29],[.64,.25]]},
    {hub:[.83,.135],rim:[[.75,.12],[.84,.075],[.94,.12],[.94,.17],[.84,.20],[.76,.17]]}
   ][i];
  }
  if(tablet){
   return [
    {hub:[.20,.65],rim:[[.02,.62],[.17,.48],[.36,.61],[.34,.77],[.20,.83],[.04,.75]]},
    {hub:[.20,.66],rim:[[.02,.51],[.20,.42],[.34,.56],[.34,.73],[.18,.84],[.02,.75]]},
    {hub:[.48,.74],rim:[[-.05,.65],[.20,.56],[1.05,.69],[1.02,.92],[.42,.82],[-.02,.91]]},
    {hub:[.82,.24],rim:[[.64,.18],[.82,.10],[.98,.18],[.96,.30],[.82,.35],[.66,.30]]},
    {hub:[.86,.21],rim:[[.79,.18],[.86,.13],[.94,.18],[.94,.25],[.86,.28],[.79,.25]]}
   ][i];
  }
  return [
   {hub:[.24,.76],rim:[[.055,.70],[.225,.61],[.425,.69],[.41,.85],[.24,.91],[.08,.83]]},
   {hub:[.24,.71],rim:[[.035,.61],[.19,.48],[.46,.63],[.48,.83],[.22,.86],[.055,.81]]},
   {hub:[.50,.79],rim:[[-.04,.72],[.23,.64],[1.04,.73],[1.02,.94],[.48,.86],[-.02,.91]]},
   {hub:[.83,.26],rim:[[.67,.18],[.83,.09],[.98,.18],[.97,.32],[.83,.39],[.69,.33]]},
   {hub:[.865,.245],rim:[[.81,.21],[.865,.145],[.93,.21],[.93,.29],[.865,.33],[.81,.29]]}
  ][i];
 }
 const path=pts=>'M'+pts.map(([x,y])=>(x*w).toFixed(2)+' '+(y*h).toFixed(2)).join('L')+'Z';
 function visibility(el,a){el.style.opacity=a.toFixed(4);el.style.visibility=a<.001?'hidden':'visible';}
 function render(p){
  if(p===lastPaint)return;lastPaint=p;
  root.dataset.renderProgress=p.toFixed(5);
  let i=0;while(i<3&&p>keys[i+1])i++;const intervals=[[.03,.23],[.36,.51],[.58,.70],[.76,.90]];const t=range(p,...intervals[i]);const a=pose(i),b=pose(i+1);const hub=a.hub.map((v,j)=>mix(v,b.hub[j],t));const rim=a.rim.map((pt,k)=>pt.map((v,j)=>mix(v,b.rim[k][j],t)));
  faces.forEach((el,k)=>el.setAttribute('d',path([hub,rim[k],rim[(k+1)%6]])));
  const rules=range(p,.16,.30)*(1-range(p,.35,.53));
  seams.forEach((el,k)=>{
   const pt=rim[(k*2+1)%6],endX=phone?.944:.958;
   if(k===0){
    const origin=rim[4];const lineY=phone?.51:tablet?.55:.53;
    el.setAttribute('d',`M${(origin[0]*w).toFixed(2)} ${(origin[1]*h).toFixed(2)}V${(lineY*h).toFixed(2)}H${(endX*w).toFixed(2)}`);
    el.style.opacity=(range(p,.78,.96)*.55).toFixed(4);
   }else{
    const y=tablet?.44+(k-1)*.15:.17+(k-1)*.18;
    el.setAttribute('d',`M${(pt[0]*w).toFixed(2)} ${(pt[1]*h).toFixed(2)}L${((tablet?.40:.55)*w).toFixed(2)} ${(y*h).toFixed(2)}`);
    el.style.opacity=(phone?0:rules*.4).toFixed(4);
   }
  });
  point.setAttribute('cx',(rim[4][0]*w).toFixed(2));point.setAttribute('cy',(rim[4][1]*h).toFixed(2));
  const depart=range(p,.32,.48),arrive=range(p,.86,.97),compact=range(p,0,.28);
  visibility(next,1-depart);next.inert=depart>.95;
  heading.style.transform=`translateY(${phone?-h*.052*compact:0}px)`;
  h2.style.fontSize=phone?mix(titleSize,compactTitleSize,compact).toFixed(2)+'px':'';
  visibility(body,1-range(p,.07,.24));
  visibility(directions,phone?range(p,.06,.25):1);
  rows.forEach((el,k)=>{const q=range(p,.31+k*.025,.43+k*.025);el.style.transform=`translateY(${-q*(55+k*18)}px)`;el.style.opacity=(1-q).toFixed(4);});
  visibility(label,1-range(p,.03,.19));
  const bridgeA=range(p,.40,.51)*(1-range(p,.76,.88));visibility(bridge,bridgeA);
  [...bridge.children].forEach((el,k)=>{const q=range(p,.40+k*.025,.51+k*.025);el.style.transform=`translateX(${(1-q)*(k?70:-40)}px)`;});
  visibility(contact,arrive);contact.inert=arrive<.8;contact.style.transform=`translateY(${(1-arrive)*35}px)`;
  root.dataset.phase=p<.14?'directions-opening':p<.39?'directions':p<.66?'continuing':p<.9?'invitation':'contact';
 }
 function measure(){
  phone=innerWidth<=760;tablet=!phone&&innerWidth<=1000;
  h2.style.fontSize='';titleSize=parseFloat(getComputedStyle(h2).fontSize);compactTitleSize=parseFloat(getComputedStyle(root).getPropertyValue('--type-heading'))||28;
  const allowed=!M.mode().reduced&&!record.open&&innerHeight>=650;
  last=0;
  enabled=allowed;root.classList.toggle('is-animated',enabled);root.classList.toggle('is-reading',!enabled);
  w=stage.clientWidth;h=enabled?stage.clientHeight:Math.min(900,stage.clientHeight);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const header=document.querySelector('.header').offsetHeight;start=root.getBoundingClientRect().top+scrollY-header;travel=parseFloat(getComputedStyle(root).getPropertyValue('--finale-travel'));
  if(enabled){contact.removeAttribute('id');anchor.id='contact';anchor.style.top='';target=clamp((scrollY-start)/travel);current=target;root.dataset.progress=target.toFixed(5);lastPaint=-1;render(current)}
  else{
   anchor.removeAttribute('id');contact.id='contact';anchor.style.top='';[next,heading,h2,body,directions,label,bridge,contact,...rows].forEach(el=>el.removeAttribute('style'));next.inert=false;contact.inert=false;root.dataset.renderProgress='static';
  }
  root.dataset.settled='true';root.dataset.ready='true';

 }
 function frame(now){
  raf=0;if(!enabled)return;
  const dt=last?Math.min(64,now-last):16;last=now;
  current+= (target-current)*(M.follow(dt,phone));
  if(Math.abs(target-current)<M.epsilon)current=target;
  render(current);root.dataset.settled=String(current===target);
  if(current!==target){raf=1;M.frame(root,frame)}else last=0;
 }
 function request(){if(!raf){raf=1;M.frame(root,frame)}}
 function onScroll(){if(!enabled)return;target=clamp((scrollY-start)/travel);root.dataset.progress=target.toFixed(5);if(current!==target)request()}
 M.connect(root,measure,onScroll);
 M.on(record,'toggle',()=>{M.invalidate();M.frame(record,()=>{if(record.open)record.scrollIntoView({block:'center',behavior:'instant'});else if(enabled)scrollTo({top:start+travel*.28,behavior:'instant'})})},{},root);
})();
