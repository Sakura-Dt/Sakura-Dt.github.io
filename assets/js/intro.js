/* One geometric identity. Cached layouts; native, reversible scroll choreography. */
(() => {
  'use strict';
const copy=window.SAKURA_COPY,M=window.SAKURA_MOTION;
  const root = document.querySelector('.intro');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const stage = $('.intro-stage'), svg = $('.identity-sheet');
  const faces = $$('.identity-face'), creases = $$('.identity-creases path');
  const hinge = $('.identity-hinge');
  const hero = $('.hero-copy'), info = $('.hero-info'), wordmark = $('.intro-wordmark');
  const greeting = $('.hero-greeting'), title = $$('.hero-copy h1>span'), words = $$('.intro-wordmark b');
  const coordinate = $('.fold-coordinate'), bridges = $$('.unfold-heading');
  const profile = $('.profile-composition'), identity = $('.profile-identity'), index = $('.profile-index');
  const regions = $$('.profile-region'), meta = $('.intro-meta'), footer = $('.intro-footer');
  const clamp = t => Math.max(0,Math.min(1,t));
  const lerp = (a,b,t) => a+(b-a)*t;
  const pt = p => p.map(v=>v.toFixed(2)).join(' ');
  const path = p => `M${p.map(pt).join('L')}Z`;
  const initialColors = ['#273cce','#1e319e','#3149e4','#213078','#18265f','#ee492d'];
  const finalColors = ['#273cce','#273cce','#273cce','#273cce','#273cce','#ee492d'];
  let W=1440,H=822,mobile=false,staticMode=false;
  function makeFrames() {
    W=stage.clientWidth;H=staticMode?innerHeight-document.querySelector('.header').offsetHeight:stage.clientHeight;mobile=W<=760;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const r=mobile?Math.min(W*.35,H*.23):Math.min(W*.25,H*.34);
    const c=mobile?[W*.54,H*.515]:[W*.70,H*.43];
    const outer=[[-.93,-.58],[.16,-1],[.87,-.38],[.95,.46],[.03,1],[-.78,.58]].map(v=>[c[0]+v[0]*r,c[1]+v[1]*r]);
    const order=[0,2,3,4,5,1];
    const opening=order.map(i=>[c,outer[i],outer[(i+1)%6]]);
    const spreads=mobile?[[-.04,-.015],[.03,-.01],[.025,.035],[-.015,.025],[-.03,0],[.07,-.045]]:[[-.04,-.045],[.065,-.005],[.055,.07],[-.02,.06],[-.055,-.005],[.075,-.065]];
    const broken=opening.map((f,i)=>f.map(v=>[v[0]+spreads[i][0]*W,v[1]+spreads[i][1]*H]));
    const tablet=W>760&&W<1000;
    const hub=mobile?[W*.88,H*.32]:tablet?[W*.48,H*.41]:[W*.36,H*.46];
    const final=[[[0,0],[W,0],hub],[hub,[W,0],[W,H]],[hub,[W,H],[W*.36,H]],[hub,[W*.36,H],[0,H]],[hub,[0,H],[0,0]],[[W*.83,H*.22],[W,0],[W,H*.22]]];
    const transformed=final.map((f,i)=>f.map((v,j)=>[lerp(broken[i][j][0],v[0],.92),lerp(broken[i][j][1],v[1],.92)]));
    const initialLines=outer.map(v=>[c,v]);
    const finalLines=mobile?[
      [[22,H*.32],[W-22,H*.32]],[[22,H*.51],[W-22,H*.51]],[[22,H*.70],[W-22,H*.70]],[[W*.90,H*.32],[W*.90,H*.90]],[[W*.83,H*.22],[W,0]],[[22,H*.92],[W-22,H*.92]]
    ]:tablet?[
      [[W*.07,H*.41],[W*.48,H*.41]],[[W*.48,H*.41],[W*.94,H*.41]],[[W*.48,H*.41],[W*.48,H*.67]],[[W*.07,H*.70],[W*.94,H*.70]],[[W*.83,H*.22],[W,0]],[[W*.07,H*.92],[W*.94,H*.92]]
    ]:[
      [[W*.07,H*.46],[W*.36,H*.46]],[[W*.36,H*.46],[W*.94,H*.46]],[[W*.36,H*.46],[W*.36,H*.86]],[[W*.70,H*.46],[W*.70,H*.86]],[[W*.83,H*.22],[W,0]],[[W*.07,H*.88],[W*.94,H*.88]]
    ];
    return {faces:[opening,broken,transformed,final,final],lines:[initialLines,initialLines,finalLines,finalLines,finalLines],centers:[c,c,hub,hub,hub]};
  }
  let frames,footerSamples=[];
  function visibility(el,alpha,y=0) {
    el.style.opacity=clamp(alpha).toFixed(4);
    el.style.visibility=alpha>.001?'visible':'hidden';
    el.style.transform=`translate3d(0,${y.toFixed(2)}px,0)`;
  }
  const smooth=M.ease;
  const phase=(p,a,b)=>smooth((p-a)/(b-a));
  const interpolate=(a,b,t)=>a.map((v,j)=>v.map((n,k)=>lerp(n,b[j][k],t)));
  const clips=$$('#intro-sheet-clip path');
  const rgb=hex=>hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16));
  const blend=(a,b,t)=>`rgb(${rgb(a).map((n,i)=>Math.round(lerp(n,rgb(b)[i],t))).join(',')})`;
  function reveal(el,p,a,b,travel=22) {
    const t=phase(p,a,b);
    visibility(el,t>0?1:0,(1-t)*travel);
    el.style.clipPath=`inset(0 0 ${((1-t)*102).toFixed(3)}% 0)`;
  }
  function inside(p,t){
    const cross=(a,b,c)=>(a[0]-c[0])*(b[1]-c[1])-(b[0]-c[0])*(a[1]-c[1]);
    const a=cross(p,t[0],t[1]),b=cross(p,t[1],t[2]),c=cross(p,t[2],t[0]);
    return !(a<0||b<0||c<0)||!(a>0||b>0||c>0);
  }
  function draw(p) {
    const expand=phase(p,.27,.52);
    const drawn=[];
    faces.forEach((el,i)=>{
      let points=interpolate(frames.faces[0][i],frames.faces[1][i],phase(p,.055+i*.006,.215+i*.006));
      points=interpolate(points,frames.faces[2][i],phase(p,.27+i*.005,.51+i*.005));
      points=interpolate(points,frames.faces[3][i],phase(p,.52+i*.004,.66+i*.004));
      drawn.push(points);
      const d=path(points);el.setAttribute('d',d);clips[i].setAttribute('d',d);
      const color=blend(initialColors[i],finalColors[i],phase(p,.30,.61));
      el.style.fill=color;el.style.stroke=color;el.style.strokeWidth='1.5';
    });
    creases.forEach((el,i)=>{
      const line=interpolate(frames.lines[0][i],frames.lines[3][i],phase(p,.24+i*.015,.64+i*.012));
      el.setAttribute('d',`M${pt(line[0])}L${pt(line[1])}`);
      el.style.opacity=String((1-phase(p,.08,.22)) + phase(p,.37,.66));
    });
    const hub=frames.centers[0].map((n,i)=>lerp(n,frames.centers[3][i],phase(p,.24,.68)));
    hinge.setAttribute('cx',hub[0]);hinge.setAttribute('cy',hub[1]);
    hinge.style.opacity=String(1-phase(p,.08,.23)+phase(p,.58,.70));
    hero.style.visibility=p<.27?'visible':'hidden';
    visibility(greeting,1-phase(p,.025,.12),-phase(p,.025,.12)*20);
    title.forEach((el,i)=>{
      const t=phase(p,.045+i*.035,.20+i*.035);
      el.style.transform=`translate3d(${t*(i?50:-65)}px,${t*(i?-40:-75)}px,0)`;
      el.style.clipPath=`inset(0 0 ${t*101}% 0)`;
    });
    visibility(info,1,0);info.style.clipPath=`inset(0 ${phase(p,.09,.225)*101}% 0 0)`;
    info.style.transform=`translate3d(${-phase(p,.09,.225)*35}px,0,0)`;
    wordmark.style.visibility=p<.255?'visible':'hidden';
    words.forEach((el,i)=>{
      const t=phase(p,[.025,.06,.085][i],[.18,.205,.24][i]);
      el.style.transform=`translate3d(${t*[-35,15,35][i]}%,${t*[135,-145,135][i]}%,0)`;
    });
    visibility(coordinate,1-phase(p,.04,.15));
    const arrive=phase(p,.175,.27),leave=phase(p,.54,.635);
    bridges.forEach(el=>{
      visibility(el,arrive*(1-leave),(1-arrive)*25+expand*H*.06-leave*30);
      el.style.clipPath=`inset(0 0 ${(1-arrive)*100}% 0)`;
    });
    profile.style.visibility=p>.615?'visible':'hidden';
    profile.style.pointerEvents=p>.68?'auto':'none';
    reveal(identity,p,.615,.735);reveal(index,p,.655,.79,12);
    regions.forEach((el,i)=>reveal(el,p,[.69,.74,.84][i],[.76,.80,.91][i]));
    info.inert=p>.225;profile.inert=p<.68;
    regions.forEach((el,i)=>el.inert=p<[.69,.74,.84][i]);
    visibility(meta,1-phase(p,.34,.44)+phase(p,.64,.74));
    meta.style.color=p>.49?'var(--paper)':'var(--ink)';
    footerSamples.forEach(({el,point})=>{const covered=drawn.some(triangle=>inside(point,triangle));el.style.color=covered?'var(--paper)':'var(--ink)'});
    const scrollLabel=p>.92?copy.scroll_work:copy.scroll_down;
    if($('.intro-scroll-label').dataset.label!==scrollLabel){$('.intro-scroll-label').innerHTML=`${scrollLabel} <span aria-hidden="true">↓</span>`;$('.intro-scroll-label').dataset.label=scrollLabel;}
    root.dataset.progress=p.toFixed(5);
  }
  let start=0,travel=1,rendered=0,queued=false,last=0,force=true,active=false,lastPainted=null,forceStatic=false;
  function paint(time) {
    queued=false;
    const target=staticMode?0:clamp((scrollY-start)/travel);
    const delta=last?Math.min(50,time-last):16.7;last=time;
    rendered=force?target:lerp(rendered,target,M.follow(delta,mobile));
    force=false;
    const settled=Math.abs(rendered-target)<M.epsilon;
    if(settled)rendered=target;
    if(lastPainted!==rendered||forceStatic){draw(rendered);lastPainted=rendered;forceStatic=false;}
    if(staticMode){
      profile.style.visibility='visible';profile.style.pointerEvents='auto';profile.inert=false;info.inert=false;
      [identity,index,...regions].forEach(el=>{visibility(el,1);el.style.clipPath='none';el.inert=false;});
    }
    root.dataset.settled=String(settled);root.dataset.renderProgress=rendered.toFixed(6);
    if(!settled)requestPaint();else last=0;
  }
  function requestPaint(){if(!queued){queued=true;M.frame(root,paint);}}
  function measure() {
    const wasStatic=staticMode,wasActive=active,previous=rendered;
    staticMode=M.mode().reduced||M.mode().short;
    document.body.classList.toggle('intro-static',staticMode);
    document.body.classList.toggle('intro-story-active',!staticMode);
    frames=makeFrames();
    const box=stage.getBoundingClientRect();
    footerSamples=[...footer.children].map(el=>{const r=el.getBoundingClientRect();return{el,point:[r.x+r.width*.5-box.x,r.y+r.height*.5-box.y]}});
    start=root.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight;
    travel=parseFloat(getComputedStyle(root).getPropertyValue('--intro-travel'));
    if(wasActive&&wasStatic!==staticMode&&scrollY<root.offsetTop+root.offsetHeight){
      scrollTo({top:staticMode?(previous>.5?H:0):(scrollY>H*.5?travel:0),behavior:'instant'});
    }
    force=true;forceStatic=true;active=true;requestPaint();

  }
  M.connect(root,measure,()=>{if(!staticMode)requestPaint()});
})();
